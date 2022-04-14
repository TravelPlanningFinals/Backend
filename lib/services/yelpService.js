const fetch = require('cross-fetch');

module.exports = class yelpService {
  static async getYelp() {
    const resp = await fetch(

      `https://api.yelp.com/v3/businesses/search?location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API}`,
        },

        params: { limit: 5, sort_by: 'relevance', term: 'bars' },

        // categories: 'bars',
      }
    );

    const data = await resp.json();

    console.log('data', data);
    return data;
    // getYelp will need to take in a city (city be a query param in our route)
  }
};
