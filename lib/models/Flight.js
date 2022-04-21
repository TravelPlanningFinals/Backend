const pool = require('../utils/pool');

module.exports = class Flight {
  id;
  airline;
  departure;
  arrival;
  flightNumber;
  tripsId;

  constructor(row) {
    this.id = row.flight_id;
    this.airline = row.airline;
    this.departure = row.departure;
    this.arrival = row.arrival;
    this.flightNumber = row.flight_number;
    this.tripsId = row.trips_id;
  }

  static async insert({ airline, departure, arrival, flightNumber, tripsId }) {
    const { rows } = await pool.query(
      'INSERT INTO flights (airline, departure, arrival, flight_number, trips_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [airline, departure, arrival, flightNumber, tripsId]
    );
    return new Flight(rows[0]);
  }

  static async getFlights() {
    const { rows } = await pool.query('SELECT * FROM flights');
    return rows.map((row) => new Flight(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM flights WHERE flight_id=$1',
      [id]
    );
    if (!rows[0]) return null;
    return new Flight(rows[0]);
  }

  static async updateById(id, { airline, departure, arrival, flightNumber }) {
    const existingFlight = await Flight.getById(id);

    if (!existingFlight) return null;
    const newAirline = airline ?? existingFlight.airline;
    const newDeparture = departure ?? existingFlight.departure;
    const newArrival = arrival ?? existingFlight.arrival;
    const newFlightNumber = flightNumber ?? existingFlight.flightNumber;

    const { rows } = await pool.query(
      'UPDATE flights SET airline=$2, departure=$3, arrival=$4, flight_number=$5 WHERE flight_id=$1 RETURNING *;',
      [id, newAirline, newDeparture, newArrival, newFlightNumber]
    );
    return new Flight(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM flights WHERE flight_id=$1 RETURNING *;',
      [id]
    );
    if (!rows[0]) return null;
    return new Flight(rows[0]);
  }
};
