const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Flight = require('../models/Flight');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const flight = await Flight.insert(req.body);
      res.send(flight);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const flights = await Flight.getFlights();
      res.send(flights);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const flight = await Flight.getById(req.params.id);
      res.send(flight);
    } catch (error) {
      next(error);
    }
  })
  .patch('/:id', async (req, res, next) => {
    try {
      const flight = await Flight.updateById(req.params.id, req.body);
      res.send(flight);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const flight = await Flight.deleteById(req.params.id);
      res.send(flight);
    } catch (error) {
      next(error);
    }
  });
