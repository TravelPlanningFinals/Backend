const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('TravelBackend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to list all flights', async () => {
    const flights = [
      {
        id: expect.any(String),
        airline: 'Alaska',
        departure: '11:30',
        arrival: '4:00',
        flightNumber: 'bd234',
      },
      {
        id: expect.any(String),
        airline: 'Spirit',
        departure: '5:30',
        arrival: '1:00',
        flightNumber: 'cb234',
      },
    ];

    const agent = request.agent(app);
    let res = await agent.get('/api/v1/flights');
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    res = await agent.get('/api/v1/flights');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([...flights]);
  });
});
