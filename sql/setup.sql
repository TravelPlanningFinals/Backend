-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users_trips CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS trips_flights CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    avatar TEXT
);

CREATE TABLE trips (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location TEXT NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE users_trips (
    users_id BIGINT REFERENCES users(id),
    trips_id BIGINT REFERENCES trips(id)
);

CREATE TABLE flights (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    airline TEXT NOT NULL,
    departure TEXT NOT NULL,
    arrival TEXT NOT NULL,
    flight_number TEXT
);

CREATE TABLE trips_flights (
    trips_id BIGINT REFERENCES trips(id),
    flights_id BIGINT REFERENCES flights(id)
);

INSERT INTO
users (username, email, avatar)
VALUES
('user.user', 'user.test@test.com', 'https://avatars.githubusercontent.com/u/87677895?v=4'),
('user.user2', 'user.test@test2.com', 'https://avatars.githubusercontent.com/u/68452618?v=4');

INSERT INTO
 trips (location, start_date, end_date)
VALUES
('vegas', '4/29/2022', '5/12/2022'),
('italy', '6/19/2022', '7/20/2022');

INSERT INTO
flights (airline, departure, arrival, flight_number)
VALUES
('Alaska', '11:30', '4:00', 'bd234'),
('Spirit', '5:30', '1:00', 'cb234');
