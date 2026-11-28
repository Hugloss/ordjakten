-- Derived SQLite index for the Swedish bank ONLY; other banks own their own schemas.
PRAGMA foreign_keys=ON;
CREATE TABLE bank (
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL CHECK(revision>=1),
  language TEXT NOT NULL
);
CREATE TABLE concepts (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('word','expression')),
  label TEXT NOT NULL,
  review_status TEXT NOT NULL
);
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);
CREATE TABLE questions (
  id TEXT PRIMARY KEY NOT NULL,
  concept_id TEXT REFERENCES concepts(id),
  revision INTEGER NOT NULL CHECK(revision>=1),
  kind TEXT NOT NULL CHECK(kind IN ('single-choice','ordering')),
  prompt TEXT NOT NULL,
  stimulus TEXT NOT NULL,
  review_status TEXT NOT NULL,
  source TEXT NOT NULL,
  story_id TEXT,
  scene_id TEXT
);
CREATE TABLE question_skills (
  question_id TEXT NOT NULL REFERENCES questions(id),
  skill_id TEXT NOT NULL REFERENCES skills(id),
  PRIMARY KEY(question_id,skill_id)
);
CREATE TABLE options (
  question_id TEXT NOT NULL REFERENCES questions(id),
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0,1)),
  answer_position INTEGER CHECK(answer_position IS NULL OR answer_position>=0),
  PRIMARY KEY(question_id,id)
);
CREATE UNIQUE INDEX option_one_correct ON options(question_id) WHERE is_correct=1;
CREATE UNIQUE INDEX option_order_position ON options(question_id,answer_position)
  WHERE answer_position IS NOT NULL;
CREATE INDEX questions_by_concept ON questions(concept_id);
CREATE INDEX questions_by_source ON questions(source);
CREATE INDEX questions_by_story ON questions(story_id);
CREATE INDEX skill_to_question ON question_skills(skill_id);
