const pool = require('../utils/pool');

module.exports = class Trip {
  id;
  location;
  startDate;
  endDate;
  users;

  constructor(row) {
    this.id = row.id;
    this.location = row.location;
    this.startDate = new Date(row.start_date).toLocaleDateString('en-US');
    this.endDate = new Date(row.end_date).toLocaleDateString('en-US');
    this.users = row.users;
  }

  static async insert({ location, startDate, endDate, users }) {
    const { rows } = await pool.query(
      'INSERT INTO trips (location, start_date, end_date, users) VALUES ($1, $2, $3, $4) RETURNING *;',
      [location, startDate, endDate, users]
    );
    return new Trip(rows[0]);
  }

  static async getTrips() {
    const { rows } = await pool.query('SELECT * FROM trips');
    return rows.map((row) => new Trip(row));
  }
};
