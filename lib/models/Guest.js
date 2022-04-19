const pool = require('../utils/pool');

module.exports = class Guest {
  id;
  name;
  email;
  emergencyConact;

  constructor(row) {
    this.id = row.id;
    this.name = row.id;
    this.email = row.id;
    this.emergencyConact = row.emergency_contact;
  }

  static async insert({ name, email, emergencyConact }) {
    const { rows } = await pool.query(
      'INSERT INTO guests (name, email, emergency_contact) VALUES ($1, $2, $3) RETURNING *;',
      [name, email, emergencyConact]
    );
    return new Guest(rows[0]);
  }

  static async getGuests() {
    const { rows } = await pool.query('SELECT * FROM guests');
    return rows.map((row) => new Guest(row));
  }
  async getGuestTrips() {
    const { rows } = await pool.query(
      `
SELECT
	location,
	start_date,
  end_date
FROM
	trips
LEFT JOIN
	guests_trips
ON
	guests_trips.trips_id = trips.id
LEFT JOIN
	guests
ON
	guests.id = guests_trips.guests_id
WHERE
	guests.id = $1
GROUP BY
	location, start_date, end_date
ORDER BY
	start_date
  `,
      [this.id]
    );
    this.trips = rows[0];
    return this;
  }
};
