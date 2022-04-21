const pool = require('../utils/pool');

module.exports = class Lodging {
  id;
  nameOfPlace;
  contactInfo;
  pricePerNight;
  checkIn;
  checkOut;
  address1;
  address2;
  city;
  state;
  zip;
  tripsId;

  constructor(row) {
    this.id = row.lodging_id;
    this.nameOfPlace = row.name_of_place;
    this.contactInfo = row.contact_info;
    this.pricePerNight = row.price_per_night;
    this.checkIn = row.check_in;
    this.checkOut = row.check_out;
    this.address1 = row.address_1;
    this.address2 = row.address_2;
    this.city = row.city;
    this.state = row.state;
    this.zip = row.zip;
    this.tripsId = row.trips_id;
  }
  static async insert({
    nameOfPlace,
    contactInfo,
    pricePerNight,
    checkIn,
    checkOut,
    address1,
    address2,
    city,
    state,
    zip,
    tripsId,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO 
            lodging (name_of_place, contact_info, price_per_night, check_in, check_out, address_1, address_2, city, state, zip, trips_id) 
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING
            *;
        `,
      [
        nameOfPlace,
        contactInfo,
        pricePerNight,
        checkIn,
        checkOut,
        address1,
        address2,
        city,
        state,
        zip,
        tripsId,
      ]
    );
    return new Lodging(rows[0]);
  }

  static async getHotelById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM lodging WHERE lodging_id=$1',
      [id]
    );
    if (!rows[0]) return null;
    return new Lodging(rows[0]);
  }

  static async updateHotelById(
    id,
    {
      nameOfPlace,
      contactInfo,
      pricePerNight,
      checkIn,
      checkOut,
      address1,
      address2,
      city,
      state,
      zip,
    }
  ) {
    const existingHotel = await Lodging.getHotelById(id);

    if (!existingHotel) return null;
    const newNameOfPlace = nameOfPlace ?? existingHotel.nameOfPlace;
    const newContactInfo = contactInfo ?? existingHotel.contactInfo;
    const newPricePerNight = pricePerNight ?? existingHotel.pricePerNight;
    const newCheckIn = checkIn ?? existingHotel.checkIn;
    const newCheckOut = checkOut ?? existingHotel.checkOut;
    const newAddress1 = address1 ?? existingHotel.address1;
    const newAddress2 = address2 ?? existingHotel.address2;
    const newCity = city ?? existingHotel.city;
    const newState = state ?? existingHotel.state;
    const newZip = zip ?? existingHotel.zip;

    const { rows } = await pool.query(
      `
    UPDATE
      lodging
    SET
      name_of_place=$2, contact_info=$3, price_per_night=$4, check_in=$5, check_out=$6, address_1=$7, address_2=$8, city=$9, state=$10, zip=$11
    WHERE
      lodging_id=$1
    RETURNING
      *;
    `,
      [
        id,
        newNameOfPlace,
        newContactInfo,
        newPricePerNight,
        newCheckIn,
        newCheckOut,
        newAddress1,
        newAddress2,
        newCity,
        newState,
        newZip,
      ]
    );
    return new Lodging(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM lodging WHERE lodging_id=$1 RETURNING *;',
      [id]
    );
    if (!rows[0]) return null;
    return new Lodging(rows[0]);
  }
};
