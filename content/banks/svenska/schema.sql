-- Bank-local derived SQLite index. Other subjects own their own schemas.
PRAGMA foreign_keys = ON;
CREATE TABLE bank (
  id TEXT PRIMARY KEY NOT NULL,
  revision INTEGER NOT NULL CHECK(revision >= 1),
  language TEXT NOT NULL
);
CREATE TABLE concepts (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('word', 'expression')),
  label TEXT NOT NULL,
  review_status TEXT NOT NULL
);
CREATE TABLE skills (
  id TEXT PRIMARY KEY NOT NULL,
  label TEXT NOT NULL
);
CREATE TABLE questions (
  id TEXT PRIMARY KEY NOT NULL,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  revision INTEGER NOT NULL CHECK(revision >= 1),
  kind TEXT NOT NULL CHECK(kind IN ('single-choice', 'ordering')),
  prompt TEXT NOT NULL,
  stimulus TEXT NOT NULL,
  review_status TEXT NOT NULL
);
CREATE TABLE question_skills (
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  PRIMARY KEY(question_id, skill_id)
);
CREATE TABLE options (
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0, 1)),
  answer_position INTEGER CHECK(answer_position IS NULL OR answer_position >= 0),
  PRIMARY KEY(question_id, id)
);
CREATE INDEX question_by_concept ON questions(concept_id);
CREATE INDEX question_skill_by_skill ON question_skills(skill_id);
CREATE UNIQUE INDEX question_single_correct ON options(question_id) WHERE is_correct=1;
CREATE UNIQUE INDEX ordering_unique_position ON options(question_id, answer_position)
  WHERE answer_position IS NOT NULL;
