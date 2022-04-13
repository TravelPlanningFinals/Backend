const pool = require('../utils/pool');

module.exports = class Flight {
  id;
  airline;
  departure;
  arrival;
  flightNumber;

  constructor(row) {
    this.id = row.id;
    this.airline = row.airline;
    this.departure = row.departure;
    this.arrival = row.arrival;
    this.flightNumber = row.flight_number;
  }

  static async insert({ airline, departure, arrival, flightNumber }) {
    const { rows } = await pool.query(
      'INSERT INTO flights (airline, departure, arrival, flight_number) VALUES ($1, $2, $3, $4) RETURNING *;',
      [airline, departure, arrival, flightNumber]
    );
    return new Flight(rows[0]);
  }

  static async getFlights() {
    const { rows } = await pool.query('SELECT * FROM flights');
    return rows.map((row) => new Flight(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM flights WHERE id=$1', [
      id,
    ]);
    if (!rows[0]) return null;
    return new Flight(rows[0]);
  }
};
