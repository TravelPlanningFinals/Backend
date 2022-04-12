const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Trip = require('../lib/models/Trip');
jest.mock('../lib/utils/github');
describe('TravelBackend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it('should be able to list all trips', async () => {
    const trips = [
      {
        id: expect.any(String),
        location: 'vegas',
        startDate: '4/29/2022',
        endDate: '5/12/2022',
        users: expect.any(String),
      },
      {
        id: expect.any(String),
        location: 'italy',
        startDate: '6/19/2022',
        endDate: '7/20/2022',
        users: expect.any(String),
      },
    ];

    const agent = request.agent(app);
    let res = await agent.get('/api/v1/trips');
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    res = await agent.get('/api/v1/trips');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([...trips]);
  });

  it('allows an authenticated user to create a new trip', async () => {
    const agent = request.agent(app);

    let res = await agent.post('/api/v1/trips');
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    const trip = await Trip.insert({
      id: expect.any(String),
      location: 'Spain',
      startDate: '9/9/2022',
      endDate: '9/21/2022',
      users: expect.any(String),
    });
    res = await agent.post('/api/v1/trips').send(trip);
    expect(res.body).toEqual({ id: expect.any(String), ...trip });
  });

  // it('should be able to create a post w/ 255 characters', async () => {
  //   const agent = request.agent(app);

  //   await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

  //   await agent.get('/login/callback');
  //   const res = await agent.post('/api/v1/trips').send({
  //     location: 'Spain',
  //     startDate: '9/9/2022',
  //     endDate: '9/21/2022',
  //     users: expect.any(String),
  //   });

  //   expect(res.body).toEqual({
  //     id: expect.any(String),
  //     location: 'Spain',
  //     startDate: '9/9/2022',
  //     endDate: '9/21/2022',
  //     users: expect.any(String),
  //   });
  // });
});
