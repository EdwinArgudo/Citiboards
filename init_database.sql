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

INSERT INTO authentication(id, username, password, user_type) VALUES (1,'stationmanager','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (2,'a','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','admin');

INSERT INTO authentication(id, username, password, user_type) VALUES (3,'u1','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (4,'u2','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (5,'u3','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (6,'u4','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (7,'u5','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');
INSERT INTO authentication(id, username, password, user_type) VALUES (8,'u6','$2a$10$GhHLcCQCHJzIUXVOfLD3neu/9UHI3wJGSDc5zHQ382lbm/b5BxKmy','user');

INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (1, 'stationmanager', 'stationmanager', 'example@example.com', '000000000', '0000 0000 0000 0000');

INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (3, 'sample', 'sample', 'sample1@sample.com', '800888881', '0000 0000 0000 0000');
INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (4, 'sample', 'sample', 'sample2@sample.com', '800888882', '0000 0000 0000 0000');
INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (5, 'sample', 'sample', 'sample3@sample.com', '800888883', '0000 0000 0000 0000');
INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (6, 'sample', 'sample', 'sample4@sample.com', '800888884', '0000 0000 0000 0000');
INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (7, 'sample', 'sample', 'sample5@sample.com', '800888885', '0000 0000 0000 0000');
INSERT INTO users(user_id, first_name, last_name, email, phone_number, credit_card)
VALUES (8, 'sample', 'sample', 'sample6@sample.com', '800888886', '0000 0000 0000 0000');

INSERT INTO stations(station_id, location, capacity) VALUES (1, 'Central Park', 20);
INSERT INTO stations(station_id, location, capacity) VALUES (2, 'Washington Square Park', 25);
INSERT INTO stations(station_id, location, capacity) VALUES (3, 'Oculus', 15);
INSERT INTO stations(station_id, location, capacity) VALUES (4, 'Rockefeller Center', 20);
INSERT INTO stations(station_id, location, capacity) VALUES (5, 'Columbus Circle', 25);
INSERT INTO stations(station_id, location, capacity) VALUES (6, 'Brooklyn Bridge', 15);


INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (1, 1, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (2, 2, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (3, 3, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (4, 4, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (5, 5, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (6, 6, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (7, 1, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (8, 2, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (9, 3, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (10, 4, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (11, 5, 1, 'parked', '1999-01-08 00:00:01');
INSERT INTO boards(board_id, station_id, user_id, board_status, last_transaction_time)
VALUES (12, 6, 1, 'parked', '1999-01-08 00:00:01');
