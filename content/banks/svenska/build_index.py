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
    """Match the NFC-based FNV option ID in public/js/banks/svenska.js."""
    value = 2166136261
    for char in unicodedata.normalize("NFC", label):
        number = ord(char)
        # The JS adapter uses code-point iteration, then charCodeAt(0).
        code_unit = number if number <= 0xFFFF else 0xD800 + ((number - 0x10000) >> 10)
        value = ((value ^ code_unit) * 16777619) & 0xFFFFFFFF
    return f"choice-{value:08x}"


def add_question(
    connection: sqlite3.Connection,
    *,
    question_id: str,
    concept_id: str,
    prompt: str,
    stimulus: str,
    status: str,
    skill: str,
    kind: str,
    answers: list,
    context: str | None = None,
) -> None:
    connection.execute(
        "INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?, ?)",
        (question_id, concept_id, 1, kind, prompt, stimulus, status),
    )
    connection.execute("INSERT INTO question_skills VALUES (?, ?)", (question_id, skill))
    if not 2 <= len(answers) <= 12:
        raise ValueError("Invalid number of authored choices: " + question_id)
    if kind == "single-choice" and sum(row["correct"] for row in answers) != 1:
        raise ValueError("Question needs exactly one correct choice: " + question_id)
    if kind not in ("single-choice", "ordering"):
        raise ValueError("Unsupported Swedish question type: " + kind)
    for position, row in enumerate(answers):
        if kind == "ordering":
            label = row
        else:
            label = ('”' + context + '” – ' + row["label"]) if context is not None else row["label"]
        if not isinstance(label, str) or not label.strip():
            raise ValueError("Blank authored option: " + question_id)
        connection.execute(
            "INSERT INTO options VALUES (?, ?, ?, ?, ?)",
            (question_id, option_id(label), label,
             int(row["correct"]) if kind == "single-choice" else 0,
             position if kind == "ordering" else None),
        )


def build(connection: sqlite3.Connection) -> dict:
    manifest = load("content/banks/svenska/manifest.json")
    if manifest.get("bankId") != "svenska":
        raise ValueError("Refusing to build another subject bank's index")
    if manifest.get("primarySource") != "public/data/expressions.json":
        raise ValueError("Unexpected canonical Swedish source")
    words = load("public/data/ordbank.json")["words"]
    expressions = load(manifest["primarySource"])["expressions"]
    missions = load("public/data/missions.json")["missions"]
    if len(words) < 121 or len(expressions) < 73 or len(missions) != len(expressions):
        raise ValueError("Unexpected loss of Swedish authored content")
    by_mission = {mission["id"]: mission for mission in missions}
    if len(by_mission) != len(missions) or set(by_mission) != {row["id"] for row in expressions}:
        raise ValueError("Swedish concept/mission references disagree")

    connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript((HERE / "schema.sql").read_text(encoding="utf-8"))
    with connection:
        connection.execute(
            "INSERT INTO bank VALUES (?, ?, ?)",
            ("svenska", manifest["version"], manifest["language"]),
        )
        for skill, label in (
            ("expression-in-context", "Förstå svenska uttryck i sitt sammanhang"),
            ("expression-in-sentence", "Välj rätt mening eller förklaring i en situation"),
            ("expression-sequence", "Ordna händelser så att uttrycket blir begripligt"),
        ):
            connection.execute("INSERT INTO skills VALUES (?, ?)", (skill, label))
        for row in words:
            connection.execute(
                "INSERT INTO concepts VALUES (?, ?, ?, ?)",
                (row["id"], "word", row["word"], row.get("review_status", "draft")),
            )
        for entry in expressions:
            concept_id = entry["id"]
            mission = by_mission[concept_id]
            status = entry.get("review_status", "draft")
            connection.execute(
                "INSERT INTO concepts VALUES (?, ?, ?, ?)",
                (concept_id, "expression", entry["phrase"], status),
            )
            add_question(
                connection,
                question_id="meaning-" + concept_id,
                concept_id=concept_id,
                prompt="Vad betyder uttrycket ”" + entry["phrase"] + "” i den här situationen?",
                stimulus=entry["scene"],
                status=status,
                skill="expression-in-context",
                kind="single-choice",
                answers=entry["options"],
            )
            if len(mission["sentences"]) != 3 or len(mission["order"]) != 3:
                raise ValueError("Incomplete Swedish mission: " + concept_id)
            add_question(
                connection,
                question_id="sentence-" + concept_id,
                concept_id=concept_id,
                prompt="Vilken mening använder uttrycket ”" + entry["phrase"] + "” rätt?",
                stimulus=mission.get("prompt") or entry["scene"],
                status=status,
                skill="expression-in-sentence",
                kind="single-choice",
                answers=mission["sentences"],
            )
            add_question(
                connection,
                question_id="order-" + concept_id,
                concept_id=concept_id,
                prompt="I vilken ordning händer sakerna i uttrycket ”" + entry["phrase"] + "”?",
                stimulus=mission.get("prompt") or entry["scene"],
                status=status,
                skill="expression-sequence",
                kind="ordering",
                answers=mission["order"],
            )
            for scene in mission.get("contextScenes", []):
                add_question(
                    connection,
                    question_id="sentence-" + scene["id"],
                    concept_id=concept_id,
                    prompt="Vad menas i just den här situationen?",
                    stimulus=scene["prompt"],
                    status=status,
                    skill="expression-in-sentence",
                    kind="single-choice",
                    answers=scene["options"],
                    context=scene["prompt"],
                )
    problems = connection.execute("PRAGMA foreign_key_check").fetchall()
    if problems:
        raise ValueError("Broken bank references: " + str(problems))
    integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
    if integrity != "ok":
        raise ValueError("SQLite integrity failed: " + integrity)
    invalid = connection.execute(
        "SELECT q.id FROM questions q LEFT JOIN options o ON o.question_id=q.id "
        "GROUP BY q.id HAVING COUNT(o.id) < 2 "
        "OR (q.kind='single-choice' AND "
        "(SUM(o.is_correct) != 1 OR SUM(o.answer_position IS NOT NULL) != 0)) "
        "OR (q.kind='ordering' AND "
        "(SUM(o.is_correct) != 0 OR SUM(o.answer_position IS NOT NULL) != COUNT(o.id) "
        "OR MIN(o.answer_position) != 0 OR MAX(o.answer_position) != COUNT(o.id)-1))"
    ).fetchall()
    if invalid:
        raise ValueError("Invalid authored choice/ordering answers: " + str(invalid))
    summary = {
        "bankId": "svenska",
        "concepts": connection.execute("SELECT COUNT(*) FROM concepts").fetchone()[0],
        "questions": connection.execute("SELECT COUNT(*) FROM questions").fetchone()[0],
        "options": connection.execute("SELECT COUNT(*) FROM options").fetchone()[0],
        "skills": connection.execute("SELECT COUNT(*) FROM skills").fetchone()[0],
    }
    if summary["concepts"] != len(words) + len(expressions) or summary["questions"] != len(expressions)*3+sum(
        len(row.get("contextScenes", [])) for row in missions
    ):
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
