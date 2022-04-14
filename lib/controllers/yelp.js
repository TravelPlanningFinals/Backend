const { Router } = require('express');
const yelpService = require('../services/yelpService');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const businesses = await yelpService.getYelp();
    // ?city =
    // req.query.city(passed in getYelp)
    res.send(businesses);
  } catch (error) {
    next(error);
  }
});
