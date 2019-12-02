/* psql -d citiboard -a -f /Users/edwinargudo/Desktop/citiboard/init_database.sql */

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS authentication;


CREATE TABLE authentication (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  type TEXT NOT NULL
);


CREATE TABLE users (
  user_id INT PRIMARY KEY REFERENCES authentication(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  credit_card TEXT
);
