const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Flight = require('../models/Flight');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const flights = await Flight.getFlights();
    res.send(flights);
  } catch (error) {
    next(error);
  }
});
