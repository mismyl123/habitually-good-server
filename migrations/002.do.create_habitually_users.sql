CREATE TABLE habitually_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  password TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  points_to_next_level INTEGER NOT NULL DEFAULT 500,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE habitually_habits
  ADD COLUMN
    user_id INTEGER REFERENCES habitually_users(id)
    ON DELETE SET NULL;