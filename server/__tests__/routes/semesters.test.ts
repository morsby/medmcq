import request from 'supertest';
import Semester from '../../models/semester';
import UserRole from '../../models/user_role';
import User from '../../models/user';
import { createUsers, createSemesters } from './functions/creation';
const authApi = '/api/auth';
const semesterApi = '/api/semesters';
let server;
let user;
let admin;

describe('semesters route', () => {
  beforeEach(async () => {
    server = require('../../server');
    user = request.agent(server);
    admin = request.agent(server);

    await createUsers();
    await createSemesters();

    // Login before each test
    let res = await admin.post(authApi).send({ username: 'admin', password: '123abc' });
    let { type } = res.body;
    expect(type).toEqual('LoginSuccess');

    let res2 = await user.post(authApi).send({ username: 'user', password: '123abc' });
    let { type: type2 } = res2.body;

    expect(type2).toEqual('LoginSuccess');
  });

  afterEach(async () => {
    await Semester.query().delete();
    await User.query().delete();
    await UserRole.query().delete();
    server.close();
  });

  it("GET '/' -- should get all 4 semesters in the right order", async () => {
    let response = await request(server).get(semesterApi);
    let semesters = response.body;

    expect(semesters.map((sem) => sem.name)).toEqual([
      'Inflammation',
      'Abdomen',
      'Hjerte-lunge-kar',
      'Familie-samfund / GOP'
    ]);
  });

  it("POST '/' -- should fail because user not permitted", async () => {
    let { status, body } = await user.post(semesterApi).send({
      value: 12,
      name: 'Test',
      shortName: 'Testing2'
    });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("POST '/' -- should insert a new semester", async () => {
    let { body } = await admin.post(semesterApi).send({
      value: 12,
      name: 'Test',
      shortName: 'Testing2'
    });
    expect(body.value).toEqual(12);
    expect(body.name).toEqual('Test');
  });

  it("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await admin.post(semesterApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  it("GET '/:id' -- should get one semester", async () => {
    let { body } = await request(server).get(`${semesterApi}/1`);

    expect(body.value).toEqual(7);
    expect(body.name).toEqual('Inflammation');
    expect(body.shortName).toEqual('Inf');
    expect(body).toHaveProperty('questionCount');
    expect(body).toHaveProperty('examSets');
    expect(body).toHaveProperty('specialties');
    expect(body).toHaveProperty('tags');
  });

  it("PATCH '/:id' -- should fail as user", async () => {
    let { status, body } = await user.patch(`${semesterApi}/1`).send({
      name: 'NewName'
    });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("PATCH '/:id' -- should patch a semester as admin", async () => {
    let { body } = await admin.patch(`${semesterApi}/1`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  it("DELETE '/:id' -- should fail as user", async () => {
    let { status, body } = await user.delete(`${semesterApi}/1`);
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("DELETE '/:id' -- should delete a semester as admin", async () => {
    let { body } = await admin.delete(`${semesterApi}/1`);
    expect(body.type).toEqual('deleteSemester');
  });
});
