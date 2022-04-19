const { Router } = require('express');
const Guest = require('../models/Guest');

module.exports = Router()
  .post('/trips/:id/guests', async (req, res, next) => {
    try {
      const guest = await Guest.insert(req.body);
      res.send(guest);
    } catch (error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const guests = await Guest.getTrips();
      res.send(guests);
    } catch (error) {
      next(error);
    }
  });
