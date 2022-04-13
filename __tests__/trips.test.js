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
      },
      {
        id: expect.any(String),
        location: 'italy',
        startDate: '6/19/2022',
        endDate: '7/20/2022',
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
    const trip = {
      location: 'Spain',
      startDate: '9/9/2022',
      endDate: '9/21/2022',
    };
    res = await agent.post('/api/v1/trips').send(trip);
    expect(res.body).toEqual({ id: expect.any(String), ...trip });
  });

  it('should be able to list a trip by id', async () => {
    const trip = await Trip.insert({
      location: 'vegas',
      startDate: '4/29/2022',
      endDate: '5/12/2022',
    });
    const res = await request(app).get(`/api/v1/trips/${trip.id}`);
    expect(res.body).toEqual(trip);
  });

  it('should be able to delete a trip', async () => {
    const trip = await Trip.insert({
      location: 'vegas',
      startDate: '4/29/2022',
      endDate: '5/12/2022',
    });
    const res = await request(app).delete(`/api/v1/trips/${trip.id}`);
    expect(res.body).toEqual(trip);
    expect(await Trip.getById(trip.id)).toBeNull();
  });

  it('should update a trip', async () => {
    const trip = await Trip.insert({
      location: 'vegas',
      startDate: '4/29/2022',
      endDate: '5/12/2022',
    });
    const res = await request(app).patch(`/api/v1/trips/${trip.id}`).send({
      location: 'Bali',
      startDate: '7/29/2022',
      endDate: '8/12/2022',
    });

    const expected = {
      id: expect.any(String),
      location: 'Bali',
      startDate: '7/29/2022',
      endDate: '8/12/2022',
    };
    expect(res.body).toEqual(expected);
    expect(await Trip.getById(trip.id)).toEqual(expected);
  });
});
