const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Guest = require('../lib/models/Guest');

jest.mock('../lib/utils/github');

describe('TravelBackend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a new guests row', async () => {
    const agent = request.agent(app);
    let res = await agent.post('/api/v1/guests');
    expect(res.status).toEqual(401);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const guest = {
      id: expect.any(String),
      name: 'chad',
      email: 'chadsemail@chad.com',
      phoneNumber: '111-111-1111',
      emergencyContact: '713-555-5555',
      tripsId: '1',
    };

    res = await agent.post('/api/v1/guests').send(guest);
    expect(res.body).toEqual({ id: expect.any(String), ...guest });
  });

  it('should be able to list all guests', async () => {
    const guests = [
      {
        id: expect.any(String),
        name: 'chad',
        email: 'chadsemail@chad.com',
        phoneNumber: '111-111-1111',
        emergencyContact: '713-555-5555',
        tripsId: '1',
      },
      {
        id: expect.any(String),
        name: 'tyler',
        email: 'tyler@email.com',
        phoneNumber: '222-222-2222',
        emergencyContact: '555-555-5555',
        tripsId: '2',
      },
    ];

    const agent = request.agent(app);
    let res = await agent.get('/api/v1/guests');
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    res = await agent.get('/api/v1/guests');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([...guests]);
  });

  it('should update a guest', async () => {
    const guest = await Guest.insert({
      name: 'chad',
      email: 'chadsemail@chad.com',
      phoneNumber: '111-111-1111',
      emergencyContact: '713-555-5555',
      tripsId: '1',
    });
    const res = await request(app).patch(`/api/v1/guests/${guest.id}`).send({
      name: 'brett',
      email: 'brettsemail@brett.com',
      phoneNumber: '444-444-4444',
      emergencyContact: '000-000-0000',
      tripsId: '1',
    });
    const expected = {
      id: expect.any(String),
      name: 'brett',
      email: 'brettsemail@brett.com',
      phoneNumber: '444-444-4444',
      emergencyContact: '000-000-0000',
      tripsId: '1',
    };
    expect(res.body).toEqual(expected);
    expect(await Guest.getById(guest.id)).toEqual(expected);
  });

  it('should be able to delete a guest', async () => {
    const guest = await Guest.insert({
      name: 'brett',
      email: 'brettsemail@brett.com',
      phoneNumber: '444-444-4444',
      emergencyContact: '000-000-0000',
      tripsId: '1',
    });
    const res = await request(app).delete(`/api/v1/guests/${guest.id}`);
    expect(res.body).toEqual(guest);
    expect(await Guest.getById(guest.id)).toBeNull();
  });
});
