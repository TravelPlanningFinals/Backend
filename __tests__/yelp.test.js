const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('travelbackend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it.skip('should get resturants from yelp api', async () => {
    const expected = {
      businesses: [
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
      ],
      region: { center: [Object] },
      total: 1500,
    };
    const res = await request(app).get('/api/v1/yelp');
    expect(res.body[0]).toEqual(expected[0]);
  });
});
