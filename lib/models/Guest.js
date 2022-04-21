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

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM guests WHERE id=$1', [id]);
    if (!rows[0]) return null;
    return new Guest(rows[0]);
  }

  static async updateById(id, { name, email, phoneNumber, emergencyContact }) {
    const existingGuest = await Guest.getById(id);

    if (!existingGuest) return null;
    const newName = name ?? existingGuest.name;
    const newEmail = email ?? existingGuest.email;
    const newPhoneNumber = phoneNumber ?? existingGuest.phoneNumber;
    const newEmergencyContact =
      emergencyContact ?? existingGuest.emergencyContact;

    const { rows } = await pool.query(
      'UPDATE guests SET name=$2, email=$3, phone_number=$4, emergency_contact=$5 WHERE id=$1 RETURNING *;',
      [id, newName, newEmail, newPhoneNumber, newEmergencyContact]
    );
    return new Guest(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM guests WHERE id=$1 RETURNING *;',
      [id]
    );
    if (!rows[0]) return null;
    return new Guest(rows[0]);
  }
};
