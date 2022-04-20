const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Flight = require('../lib/models/Flight');

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
        tripsId: expect.any(String),
      },
      {
        id: expect.any(String),
        airline: 'Spirit',
        departure: '5:30',
        arrival: '1:00',
        flightNumber: 'cb234',
        tripsId: expect.any(String),
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

  it.skip('allows an authenticated user to create a new flight', async () => {
    const agent = request.agent(app);

    let res = await agent.post('/api/v1/flights');
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    const flight = {
      airline: 'Alaska',
      departure: '10:30',
      arrival: '3:30',
      flightNumber: 'aa234',
    };
    res = await agent.post('/api/v1/flights').send(flight);
    expect(res.body).toEqual({ id: expect.any(String), ...flight });
  });

  it.skip('should be able to list a flight by id', async () => {
    const flight = await Flight.insert({
      airline: 'Alaska',
      departure: '11:30',
      arrival: '4:00',
      flightNumber: 'bd234',
    });
    const res = await request(app).get(`/api/v1/flights/${flight.id}`);
    expect(res.body).toEqual(flight);
  });

  it.skip('should update a flight', async () => {
    const flight = await Flight.insert({
      airline: 'Alaska',
      departure: '11:30',
      arrival: '4:00',
      flightNumber: 'bd234',
    });
    const res = await request(app).patch(`/api/v1/flights/${flight.id}`).send({
      airline: 'Delta',
      departure: '11:30',
      arrival: '4:00',
      flightNumber: 'ef234',
    });

    const expected = {
      id: expect.any(String),
      airline: 'Delta',
      departure: '11:30',
      arrival: '4:00',
      flightNumber: 'ef234',
    };
    expect(res.body).toEqual(expected);
    expect(await Flight.getById(flight.id)).toEqual(expected);
  });

  it.skip('should be able to delete a flight', async () => {
    const flight = await Flight.insert({
      airline: 'Alaska',
      departure: '11:30',
      arrival: '4:00',
      flightNumber: 'bd234',
    });
    const res = await request(app).delete(`/api/v1/flights/${flight.id}`);
    expect(res.body).toEqual(flight);
    expect(await Flight.getById(flight.id)).toBeNull();
  });
});
