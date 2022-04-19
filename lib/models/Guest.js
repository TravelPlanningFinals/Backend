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
};
