#!/usr/bin/env python3
"""Generate a Swedish-only relational read index from the unified authored registry.

Git/JS/JSON own the source. No question is manually duplicated in SQLite.
The SQLite file is optional and never committed. Other banks use their own DB.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def sources() -> tuple[dict, list[dict], list[dict]]:
    manifest = json.loads((HERE / "manifest.json").read_text(encoding="utf-8"))
    if manifest.get("bankId") != "svenska":
        raise ValueError("Refusing to build a shared subject database")
    for relative in manifest["sourceFiles"]:
        if not (ROOT / relative).is_file():
            raise ValueError("Missing authored source: " + relative)
    expressions = json.loads((ROOT / "public/data/expressions.json").read_text(encoding="utf-8"))
    words = json.loads((ROOT / "public/data/ordbank.json").read_text(encoding="utf-8"))
    return manifest, words["words"], expressions["expressions"]


def export_questions() -> dict:
    # JavaScript owns bank adapters and grading IDs. This preserves exact parity
    # instead of maintaining a second Python implementation of each question type.
    result = subprocess.run(
        ["node", str(ROOT / "scripts/export-question-catalog.js"), "--bank", "svenska", "--dump"],
        cwd=ROOT, check=True, capture_output=True, text=True,
    )
    catalog = json.loads(result.stdout)
    if catalog.get("bank", {}).get("bankId") != "svenska":
        raise ValueError("Cross-bank registry export rejected")
    return catalog


def build(db: sqlite3.Connection) -> dict:
    manifest, words, expressions = sources()
    catalog = export_questions()
    questions = catalog["questions"]
    if len(questions) < 1300 or len({q["ref"]["id"] for q in questions}) != len(questions):
        raise ValueError("Missing or duplicated Swedish authored question IDs")
    db.execute("PRAGMA foreign_keys=ON")
    db.executescript((HERE / "schema.sql").read_text(encoding="utf-8"))
    concepts = {}
    for row in words:
        concepts[row["id"]] = ("word", row["word"], row.get("review_status", "draft"))
    for row in expressions:
        concepts[row["id"]] = ("expression", row["phrase"], row.get("review_status", "draft"))
    if len(concepts) != len(words) + len(expressions):
        raise ValueError("Duplicate Swedish concept IDs")
    try:
        with db:
            db.execute("INSERT INTO bank VALUES (?,?,?)",
                       (manifest["bankId"], manifest["version"], manifest["language"]))
            db.executemany(
                "INSERT INTO concepts VALUES (?,?,?,?)",
                [(id_, *row) for id_, row in concepts.items()],
            )
            skills = set()
            for item in questions:
                ref = item["ref"]
                if ref["bankId"] != "svenska" or ref["revision"] < 1:
                    raise ValueError("Question escaped Swedish bank")
                qid = ref["id"]
                provenance = item.get("provenance") or {}
                source = provenance.get("source")
                if source not in manifest["sourceFiles"]:
                    raise ValueError("Unregistered authored source for " + qid + ": " + str(source))
                concept = provenance.get("legacyConceptId")
                if concept is not None and concept not in concepts:
                    raise ValueError("Unknown Swedish concept: " + concept)
                spec = item["responseSpec"]
                kind = spec["kind"]
                assessment = item["assessmentSpec"]
                if kind not in ("ordering", "single-choice") or kind != assessment["kind"]:
                    raise ValueError("Unsupported or inconsistent assessment kind: " + qid)
                db.execute(
                    "INSERT INTO questions VALUES (?,?,?,?,?,?,?,?,?,?)",
                    (qid, concept, ref["revision"], kind, item["prompt"],
                     item.get("stimulus") or item["prompt"], item.get("reviewStatus", "draft"),
                     source, provenance.get("storyId"), provenance.get("sceneId")),
                )
                for skill in item["skillIds"]:
                    if skill not in skills:
                        db.execute("INSERT INTO skills VALUES (?,?)", (skill, skill))
                        skills.add(skill)
                    db.execute("INSERT INTO question_skills VALUES (?,?)", (qid, skill))
                opts = spec["options"]
                if not 2 <= len(opts) <= 12:
                    raise ValueError("Invalid option count in " + qid)
                correct = assessment.get("correctOptionId")
                order = assessment.get("correctOrder")
                if kind == "ordering":
                    if not isinstance(order, list) or len(order) != len(opts) or set(order) != {o["id"] for o in opts}:
                        raise ValueError("Invalid ordering specification for " + qid)
                else:
                    if correct not in {o["id"] for o in opts}:
                        raise ValueError("Invalid correct option for " + qid)
                for option in opts:
                    db.execute(
                        "INSERT INTO options VALUES (?,?,?,?,?)",
                        (qid, option["id"], option["label"],
                         int(kind == "single-choice" and option["id"] == correct),
                         order.index(option["id"]) if kind == "ordering" else None),
                    )

    except sqlite3.IntegrityError as exc:
        raise ValueError("SQLite relational integrity failure: " + str(exc)) from exc

    errors = db.execute("PRAGMA foreign_key_check").fetchall()
    if errors or db.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
        raise ValueError("Invalid Swedish bank relational index")
    malformed = db.execute("""
      SELECT q.id FROM questions q JOIN options o ON o.question_id=q.id
      GROUP BY q.id HAVING COUNT(o.id)<2 OR
      (q.kind='single-choice' AND (SUM(o.is_correct)!=1 OR SUM(o.answer_position IS NOT NULL)!=0)) OR
      (q.kind='ordering' AND (SUM(o.is_correct)!=0 OR
       SUM(o.answer_position IS NOT NULL)!=COUNT(o.id) OR
       MIN(o.answer_position)!=0 OR MAX(o.answer_position)!=COUNT(o.id)-1))
    """).fetchall()
    if malformed:
        raise ValueError("Malformed authored questions: " + str(malformed[:5]))
    report = {
        "bankId": "svenska",
        "concepts": db.execute("SELECT COUNT(*) FROM concepts").fetchone()[0],
        "questions": db.execute("SELECT COUNT(*) FROM questions").fetchone()[0],
        "options": db.execute("SELECT COUNT(*) FROM options").fetchone()[0],
        "skills": db.execute("SELECT COUNT(*) FROM skills").fetchone()[0],
        "sources": db.execute("SELECT COUNT(DISTINCT source) FROM questions").fetchone()[0],
    }
    if report["questions"] != len(questions):
        raise ValueError("Registry and SQLite question counts differ")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate the generated index in memory")
    parser.add_argument("--output", type=Path, help="Write a derived bank-local .sqlite file")
    parser.add_argument("--search", help="Search authored question text and concepts")
    parser.add_argument("--id", help="Find an exact bank-local question ID")
    args = parser.parse_args()
    if args.check and args.output:
        parser.error("--check and --output cannot be combined")
    if args.output:
        target = args.output.resolve()
        if target.suffix != ".sqlite" or target.exists():
            parser.error("Output must be a new .sqlite file")
        target.parent.mkdir(parents=True, exist_ok=True)
        db = sqlite3.connect(target)
    else:
        db = sqlite3.connect(":memory:")
    try:
        report = build(db)
        if args.search or args.id:
            if args.id:
                query = "WHERE q.id=?"
                values = (args.id,)
            else:
                needle = "%" + args.search.replace("%", "\\%").replace("_", "\\_") + "%"
                query = """WHERE q.prompt LIKE ? ESCAPE '\\' OR q.stimulus LIKE ? ESCAPE '\\'
                    OR COALESCE(c.label,'') LIKE ? ESCAPE '\\'"""
                values = (needle, needle, needle)
            rows = db.execute(
                """SELECT q.id,q.source,q.kind,q.prompt,c.label
                   FROM questions q LEFT JOIN concepts c ON c.id=q.concept_id
                """ + query + " ORDER BY q.id LIMIT 30", values,
            ).fetchall()
            report["matches"] = [{"questionId": qid, "source": source, "kind": kind,
                                  "prompt": prompt, "concept": concept}
                                 for qid, source, kind, prompt, concept in rows]
        print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    finally:
        db.close()


if __name__ == "__main__":
    main()
