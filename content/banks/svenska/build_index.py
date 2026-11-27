#!/usr/bin/env python3
"""Build/validate a per-bank SQLite index from canonical Swedish content.

No content is edited. By default the database is in memory; --output writes
one standalone derived SQLite file. No other subject bank is ever read.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def load(relative: str) -> dict:
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def option_id(label: str) -> str:
    """Match the stable, NFC-based FNV choice ID in public/js/banks/svenska.js."""
    value = 2166136261
    for char in unicodedata.normalize("NFC", label):
        number = ord(char)
        # The JS adapter iterates code points but uses charCodeAt(0).
        code_unit = number if number <= 0xFFFF else 0xD800 + ((number - 0x10000) >> 10)
        value = ((value ^ code_unit) * 16777619) & 0xFFFFFFFF
    return f"choice-{value:08x}"


def build(connection: sqlite3.Connection) -> dict:
    manifest = load("content/banks/svenska/manifest.json")
    if manifest.get("bankId") != "svenska":
        raise ValueError("Refusing to build another subject bank's index")
    if manifest.get("primarySource") != "public/data/expressions.json":
        raise ValueError("Unexpected canonical Swedish source")
    words = load("public/data/ordbank.json")["words"]
    expressions = load(manifest["primarySource"])["expressions"]
    if len(words) < 121 or len(expressions) < 73:
        raise ValueError("Unexpected loss of Swedish source content")
    connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript((HERE / "schema.sql").read_text(encoding="utf-8"))
    with connection:
        connection.execute(
            "INSERT INTO bank VALUES (?, ?, ?)",
            ("svenska", manifest["version"], manifest["language"]),
        )
        connection.execute(
            "INSERT INTO skills VALUES (?, ?)",
            ("expression-in-context", "Förstå svenska uttryck i sitt sammanhang"),
        )
        for row in words:
            connection.execute(
                "INSERT INTO concepts VALUES (?, ?, ?, ?)",
                (row["id"], "word", row["word"], row.get("review_status", "draft")),
            )
        for row in expressions:
            connection.execute(
                "INSERT INTO concepts VALUES (?, ?, ?, ?)",
                (row["id"], "expression", row["phrase"], row.get("review_status", "draft")),
            )
            question_id = "meaning-" + row["id"]
            connection.execute(
                "INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    question_id, row["id"], 1, "single-choice",
                    "Vad betyder uttrycket ”" + row["phrase"] + "” i den här situationen?",
                    row["scene"], row.get("review_status", "draft"),
                ),
            )
            connection.execute(
                "INSERT INTO question_skills VALUES (?, ?)",
                (question_id, "expression-in-context"),
            )
            if len(row["options"]) != 5 or sum(option["correct"] for option in row["options"]) != 1:
                raise ValueError("Invalid canonical expression answers: " + row["id"])
            for option in row["options"]:
                connection.execute(
                    "INSERT INTO options VALUES (?, ?, ?, ?)",
                    (question_id, option_id(option["label"]), option["label"], int(option["correct"])),
                )
    problems = connection.execute("PRAGMA foreign_key_check").fetchall()
    if problems:
        raise ValueError("Broken bank references: " + str(problems))
    integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
    if integrity != "ok":
        raise ValueError("SQLite integrity failed: " + integrity)
    invalid = connection.execute(
        "SELECT q.id FROM questions q LEFT JOIN options o ON o.question_id=q.id "
        "GROUP BY q.id HAVING COUNT(o.id) < 2 OR SUM(o.is_correct) != 1"
    ).fetchall()
    if invalid:
        raise ValueError("Questions without exactly one correct choice: " + str(invalid))
    summary = {
        "bankId": "svenska",
        "concepts": connection.execute("SELECT COUNT(*) FROM concepts").fetchone()[0],
        "questions": connection.execute("SELECT COUNT(*) FROM questions").fetchone()[0],
        "options": connection.execute("SELECT COUNT(*) FROM options").fetchone()[0],
        "skills": connection.execute("SELECT COUNT(*) FROM skills").fetchone()[0],
    }
    if summary["concepts"] != len(words) + len(expressions) or summary["questions"] != len(expressions):
        raise ValueError("SQLite/source parity mismatch")
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate in memory (default)")
    parser.add_argument("--output", type=Path, help="Write a derived bank-scoped .sqlite file")
    parser.add_argument("--search", help="Search this bank's generated questions")
    args = parser.parse_args()
    if args.check and args.output:
        parser.error("--check and --output are mutually exclusive")
    if args.output:
        target = args.output.resolve()
        if target.suffix != ".sqlite":
            parser.error("Output must end in .sqlite")
        if target.exists():
            parser.error("Refusing to overwrite an existing index")
        target.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(target)
    else:
        connection = sqlite3.connect(":memory:")
    try:
        report = build(connection)
        if args.search:
            needle = "%" + args.search.replace("%", "\\%").replace("_", "\\_") + "%"
            matches = connection.execute(
                "SELECT q.id, c.label FROM questions q JOIN concepts c ON c.id=q.concept_id "
                "WHERE c.label LIKE ? ESCAPE '\\' OR q.prompt LIKE ? ESCAPE '\\' "
                "ORDER BY q.id LIMIT 20", (needle, needle),
            ).fetchall()
            report["matches"] = [{"questionId": qid, "concept": text} for qid, text in matches]
        print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    finally:
        connection.close()


if __name__ == "__main__":
    main()
