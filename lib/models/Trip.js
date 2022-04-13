const pool = require('../utils/pool');

module.exports = class Trip {
  id;
  location;
  startDate;
  endDate;

  constructor(row) {
    this.id = row.id;
    this.location = row.location;
    this.startDate = new Date(row.start_date).toLocaleDateString('en-US');
    this.endDate = new Date(row.end_date).toLocaleDateString('en-US');
  }

  static async insert({ location, startDate, endDate }) {
    const { rows } = await pool.query(
      'INSERT INTO trips (location, start_date, end_date) VALUES ($1, $2, $3) RETURNING *;',
      [location, startDate, endDate]
    );
    return new Trip(rows[0]);
  }

  static async getTrips() {
    const { rows } = await pool.query('SELECT * FROM trips');
    return rows.map((row) => new Trip(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM trips WHERE id=$1', [id]);
    if (!rows[0]) return null;
    return new Trip(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM trips WHERE id=$1 RETURNING *;',
      [id]
    );
    if (!rows[0]) return null;
    return new Trip(rows[0]);
  }

  static async updateById(id, { location, startDate, endDate }) {
    const existingTrip = await Trip.getById(id);

    if (!existingTrip) return null;
    const newLocation = location ?? existingTrip.location;
    const newStartDate = startDate ?? existingTrip.startDate;
    const newEndDate = endDate ?? existingTrip.endDate;

    const { rows } = await pool.query(
      'UPDATE trips SET location=$2, start_date=$3, end_date=$4 WHERE id=$1 RETURNING *;',
      [id, newLocation, newStartDate, newEndDate]
    );
    return new Trip(rows[0]);
  }
};
