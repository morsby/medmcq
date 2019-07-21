import request from 'supertest';
import sample_specialties from '../../_testconfigs_/data/sample_specialties';
import Specialty from '../../models/specialty';
import { createUsers, createSemesters } from '../../_testconfigs_/functions/creation';
import User from '../../models/user';
import UserRole from '../../models/user_role';
import Semester from '../../models/semester';
const authApi = '/api/auth';
const specialtyApi = '/api/specialties';
let server;
let admin;

describe('specialties route', () => {
  beforeEach(async () => {
    server = require('../../server');
    admin = request.agent(server);

    await createSemesters();
    await createUsers();
    await Specialty.query().insertGraph(sample_specialties);

    // Login
    const res = await admin.post(authApi).send({ username: 'admin', password: '123abc' });
    expect(res.body.type).toEqual('LoginSuccess');
  });

  afterEach(async () => {
    await Semester.query().delete();
    await Specialty.query().delete();
    await User.query().delete();
    await UserRole.query().delete();
    server.close();
  });

  it("GET '/' -- should get all specialties", async () => {
    let response = await request(server).get(specialtyApi);
    let specialties = response.body;

    expect(specialties.length).toBe(5);
    expect(typeof specialties[0].name).toBe('string');
  });

  it("POST '/' -- should fail because not admin", async () => {
    let { body, status } = await request(server)
      .post(specialtyApi)
      .send({
        name: 'Test',
        semesterId: 4
      });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("POST '/' -- should insert a new specialty", async () => {
    let { body } = await admin.post(specialtyApi).send({
      name: 'Test',
      semesterId: 4
    });
    expect(body.semesterId).toEqual(4);
    expect(body.name).toEqual('Test');
  });

  it("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await admin.post(specialtyApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  it("GET '/:id' -- should get one specialty", async () => {
    let { body } = await request(server).get(`${specialtyApi}/1`);

    expect(body.semesterId).toEqual(1);
    expect(typeof body.name).toBe('string');
    expect(body).toHaveProperty('semester');
    expect(body).toHaveProperty('voteCount');
    expect(Array.isArray(body.questions)).toBe(true);
  });

  it("PATCH '/:id' -- should fail because not admin", async () => {
    let { status, body } = await request(server)
      .patch(`${specialtyApi}/1`)
      .send({
        name: 'NewName'
      });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("PATCH '/:id' -- should patch a specialty", async () => {
    let { body } = await admin.patch(`${specialtyApi}/1`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  it("DELETE '/:id' -- should fail because not admin", async () => {
    let { body, status } = await request(server).delete(`${specialtyApi}/1`);
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("DELETE '/:id' -- should delete a specialty", async () => {
    let { body } = await admin.delete(`${specialtyApi}/1`);
    expect(body.type).toEqual('deleteSpecialty');
  });
});
