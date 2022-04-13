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

  static async getFlights() {
    const { rows } = await pool.query('SELECT * FROM flights');
    return rows.map((row) => new Flight(row));
  }
};
