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


CREATE TABLE boards (
    board_id INT PRIMARY KEY NOT NULL
);


CREATE TABLE stations (
    station_id INT PRIMARY KEY,
    location TEXT NOT NULL,
    capacity INT NOT NULL
);


CREATE TABLE boards_stations (
    board_id INT PRIMARY KEY REFERENCES boards(board_id),
    station_id INT REFERENCES stations(station_id) NOT NULL,
    board_status use_status NOT NULL,
    last_transaction_time TIME(HH:MM:SS.pp)
);
