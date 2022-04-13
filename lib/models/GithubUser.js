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
      `SELECT
	location,
	start_date,
    end_date
FROM
	trips
LEFT JOIN
	users_trips
ON
	users_trips.trips_id = trips.id
LEFT JOIN
	users
ON
	users.id = users_trips.users_id
WHERE
	users.id = $1
GROUP BY
	location, start_date, end_date
ORDER BY
	start_date`,
      [this.id]
    );
    this.trips = rows[0];
    return this;
  }
};
