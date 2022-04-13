const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Trip = require('../models/Trip');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const trip = await Trip.insert(req.body);
      res.send(trip);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const trips = await Trip.getTrips();
      res.send(trips);
    } catch (error) {
      next(error);
    }
  });