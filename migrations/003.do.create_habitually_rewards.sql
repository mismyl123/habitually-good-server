CREATE TABLE habitually_rewards (
  id SERIAL PRIMARY KEY,
  reward TEXT NOT NULL,
  user_id INTEGER REFERENCES habitually_users(id) ON DELETE CASCADE NULL
);