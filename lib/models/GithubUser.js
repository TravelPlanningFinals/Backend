const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static async insert({ username, email, avatar }) {
    if (!username) throw new Error('Username is required');

    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, avatar)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [username, email, avatar]
    );

    return new GithubUser(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE username=$1
      `,
      [username]
    );

    if (!rows[0]) return null;

    return new GithubUser(rows[0]);
  }

  async getTrips() {
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
