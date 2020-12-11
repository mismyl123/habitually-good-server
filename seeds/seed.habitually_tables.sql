BEGIN;

TRUNCATE
  habitually_users,
  habitually_habits
  RESTART IDENTITY CASCADE;

INSERT INTO habitually_users (username, first_name, password, level, points)
VALUES
  ('demo', 'Demo', '$2a$12$Xtsip8DrajF4Va0dou5T9uLgDrWme3Mk/PWoCXLm5a9hK5fx6G5Ky', 0, 490);  -- password = 'password'
  -- ('demo2', 'Demo-2', '$2a$12$WJFfSXfZEpXIyGfhUoGUt.gn8HjcVSkwRD.j8/Q2e/LlzhmYK0OVi', 13), -- password = '12345'
  -- ('demo3', 'Demo-3', '$2a$12$Kx1KcC51cjmqo7HklDLGaO2dxJ0ykPiqddi7QB0b0XN4hoYPpB6cq', 4);  -- password = 'demo'

INSERT INTO habitually_habits (text, due_date, reward, points, user_id)
VALUES
  ('Drink More Water', '2020-12-10', 'bubble bath', 50, 1),
  ('Stretch Every Hour', '2021-01-30', 'watch favorite movie', 75, 1),
  ('Watch Postgres Ted Talk', '2020-12-17', 'do my nails', 100, 1),
  ('One Week Social Media Break', '2021-02-01', 'One day off everything', 10, 1),
  ('Take a Daily Walk', '2020-12-25', 'soothing face mask', 25, 1),
  ('One Month Sobriety Challenge', '2021-03-20', 'buy myself flowers', 75, 1),
  ('Floss Teeth', '2020-12-31', 'Order my favorite Starbucks', 100, 1),
  ('Make a New Budget', '2021-04-04', 'Buy something small but fun', 10, 1);  

COMMIT;