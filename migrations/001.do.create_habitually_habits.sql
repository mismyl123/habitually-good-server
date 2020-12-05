CREATE TABLE habitually_habits (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  due_date DATE DEFAULT NULL,
  reward TEXT,
  points NUMERIC NOT NULL
);