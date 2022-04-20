const pool = require('../utils/pool');

module.exports = class Guest {
  id;
  name;
  email;
  phoneNumber;
  emergencyContact;
  tripsId;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.email = row.email;
    this.phoneNumber = row.phone_number;
    this.emergencyContact = row.emergency_contact;
    this.tripsId = row.trips_id;
  }

  static async insert({ name, email, phoneNumber, emergencyContact, tripsId }) {
    const { rows } = await pool.query(
      'INSERT INTO guests (name, email, phone_number, emergency_contact, trips_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [name, email, phoneNumber, emergencyContact, tripsId]
    );
    return new Guest(rows[0]);
  }

  static async getGuests() {
    const { rows } = await pool.query('SELECT * FROM guests');
    return rows.map((row) => new Guest(row));
  }
};
