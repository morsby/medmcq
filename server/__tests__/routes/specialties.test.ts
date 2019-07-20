import _ from 'lodash';
import request from 'supertest';
const specialtyApi = '/api/specialties';
let server;
let agent;

describe('specialties route', () => {
  beforeEach(() => {
    server = require('../../server');
    agent = request.agent(server);
  });

  afterEach(() => {
    server.close();
  });

  // Settings vars to reuse across tests
  let firstSpecialtyId, newSpecialtyId;

  test("GET '/' -- should get all specialties", async () => {
    let response = await request(server).get(specialtyApi);
    let specialties = response.body;

    // To reuse the id without making a second API call -- id can change if rerunning seeds
    firstSpecialtyId = specialties[0].id;
    let sortedSpecialties = _.sortBy(specialties, ['name']);
    let seededSpecialties = require('../../seeds/data/12_sample_specialer.json');
    seededSpecialties = seededSpecialties.map((s) => s.name).sort();

    expect(sortedSpecialties.map((sem) => sem.name)).toEqual(seededSpecialties);
  });

  test("POST '/' -- should fail because not admin", async () => {
    let { body, status } = await request(server)
      .post(specialtyApi)
      .send({
        name: 'Test',
        semesterId: 4
      });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("POST '/' -- should insert a new specialty", async () => {
    await agent.post('/api/auth').send({ username: 'TestAdmin', password: 'TestPassword123' });

    let { body } = await agent.post(specialtyApi).send({
      name: 'Test',
      semesterId: 4
    });
    newSpecialtyId = body.id;
    expect(body.semesterId).toEqual(4);
    expect(body.name).toEqual('Test');
  });

  test("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await agent.post(specialtyApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  test("GET '/:id' -- should get one specialty", async () => {
    let { body } = await request(server).get(`${specialtyApi}/${firstSpecialtyId}`);

    expect(body.name).toEqual('Almen medicin');
    expect(body.semesterId).toEqual(1);
    expect(body).toHaveProperty('semester');
    expect(body).toHaveProperty('voteCount');
    expect(Array.isArray(body.questions)).toBe(true);
  });

  test("PATCH '/:id' -- should fail because not admin", async () => {
    let { status, body } = await request(server)
      .patch(`${specialtyApi}/${newSpecialtyId}`)
      .send({
        name: 'NewName'
      });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("PATCH '/:id' -- should patch a specialty", async () => {
    let { body } = await agent.patch(`${specialtyApi}/${newSpecialtyId}`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  test("DELETE '/:id' -- should fail because not admin", async () => {
    let { body, status } = await request(server).delete(`${specialtyApi}/${newSpecialtyId}`);
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("DELETE '/:id' -- should delete a specialty", async () => {
    let { body } = await agent.delete(`${specialtyApi}/${newSpecialtyId}`);
    expect(body.type).toEqual('deleteSpecialty');
  });
});
