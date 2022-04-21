const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Guest = require('../models/Guest');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const guest = await Guest.insert(req.body);
      res.send(guest);
    } catch (error) {
      next(error);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const guests = await Guest.getTrips();
      res.send(guests);
    } catch (error) {
      next(error);
    }
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const guest = await Guest.updateById(req.params.id, req.body);
      res.send(guest);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const guest = await Guest.deleteById(req.params.id);
      res.send(guest);
    } catch (error) {
      next(error);
    }
  });
