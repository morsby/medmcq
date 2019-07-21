import _ from 'lodash';
import request from 'supertest';
import { createUsers, createSemesters } from './functions/creation';
import UserRole from '../../models/user_role';
import User from '../../models/user';
import Tag from '../../models/tag';
import sample_tags from './data/sample_tags';
import Semester from '../../models/semester';
const tagApi = '/api/tags';
let server;
let admin;

describe('tags route', () => {
  beforeEach(async () => {
    server = require('../../server');
    admin = request.agent(server);

    await createUsers();
    await createSemesters();
    await Tag.query().insertGraph(sample_tags);
    const res = await admin.post('/api/auth').send({ username: 'admin', password: '123abc' });
    expect(res.body.type).toBe('LoginSuccess');
  });

  afterEach(async () => {
    await User.query().delete();
    await UserRole.query().delete();
    await Tag.query().delete();
    await Semester.query().delete();
    server.close();
  });

  it("GET '/' -- should get all tags", async () => {
    let response = await request(server).get(tagApi);
    let tags = response.body;

    expect(tags.length).toBe(5);
  });

  it("POST '/' -- should fail non-admin", async () => {
    let { status, body } = await request(server)
      .post(tagApi)
      .send({
        name: 'Test',
        semesterId: 4
      });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("POST '/' -- should insert a new tag", async () => {
    let { body } = await admin.post(tagApi).send({
      name: 'Test',
      semesterId: 4
    });
    expect(body.semesterId).toEqual(4);
    expect(body.name).toEqual('Test');
  });

  it("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await admin.post(tagApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  it("GET '/:id' -- should get one tag", async () => {
    let { body } = await request(server).get(`${tagApi}/1`);

    expect(body.name).toEqual('Paraklinik');
    expect(body.semesterId).toEqual(1);
    expect(body).toHaveProperty('semester');
    expect(body).toHaveProperty('voteCount');
    expect(Array.isArray(body.questions)).toBe(true);
  });

  it("PATCH '/:id' -- should fail non-admin", async () => {
    let { status, body } = await request(server)
      .patch(`${tagApi}/1`)
      .send({
        name: 'NewName'
      });
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("PATCH '/:id' -- should patch a tag", async () => {
    let { body } = await admin.patch(`${tagApi}/1`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  it("DELETE '/:id' -- should fail non-admin", async () => {
    let { status, body } = await request(server).delete(`${tagApi}/1`);
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("DELETE '/:id' -- should delete a tag", async () => {
    let { body } = await admin.delete(`${tagApi}/1`);
    expect(body.type).toEqual('deleteTag');
  });
});
