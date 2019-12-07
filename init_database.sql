DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS authentication;
DROP TABLE IF EXISTS stations;


DROP TYPE adm_usr;
DROP TYPE use_status;

CREATE TYPE adm_usr AS ENUM('admin', 'user');
CREATE TYPE use_status AS ENUM('in_use', 'parked');

CREATE TABLE authentication (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type adm_usr NOT NULL
);

CREATE TABLE users (
    user_id INT PRIMARY KEY REFERENCES authentication(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    credit_card TEXT NOT NULL
);

CREATE TABLE stations (
    station_id INT PRIMARY KEY,
    location TEXT NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE boards (
    board_id INT PRIMARY KEY,
    station_id INT REFERENCES stations(station_id) NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL,
    board_status use_status NOT NULL,
    last_transaction_time TIMESTAMP NOT NULL
);

INSERT INTO authentication(id, username, password, user_type) VALUES (1,'stationmanager','password','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (2,'u','u','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (3,'a','a','admin');

INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (1, 'stationmanager', 'stationmanager', 'example@example.com', '000000000', '0000 0000 0000 0001');
INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (2, 'sample', 'sample', 'sample@sample.com', '800888888', '0000 0000 0000 0000');

INSERT INTO stations(station_id, location, capacity) VALUES (1, 'Central Park', 20);
INSERT INTO stations(station_id, location, capacity) VALUES (2, 'WaSquaPa', 25);
INSERT INTO stations(station_id, location, capacity) VALUES (3, 'Oculus', 15);

INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (1, 1, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (2, 2, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (3, 3, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (4, 1, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (5, 2, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (6, 3, 1, 'parked', '1999-01-08 00:00:01');
