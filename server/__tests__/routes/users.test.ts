import request from 'supertest';
import { createUsers } from './functions/creation';
import UserRole from '../../models/user_role';
import User from '../../models/user';
const userApi = '/api/users';

let server;
let admin;
let user;
let anon;
let username;

beforeEach(async () => {
  server = require('../../server');
  admin = request.agent(server);
  user = request.agent(server);
  anon = request.agent(server);
  username = 'user';

  await createUsers();

  let res = await admin.post('/api/auth').send({ username: 'admin', password: '123abc' });
  expect(res.body.type).toBe('LoginSuccess');
  res = await user.post('/api/auth').send({ username: 'user', password: '123abc' });
  expect(res.body.type).toBe('LoginSuccess');
});

afterEach(async () => {
  await User.query().delete();
  await UserRole.query().delete();
  server.close();
});

/*
 ==============================
       TESTS FOR ANONS
 ==============================
 */
describe('users route: not logged in', () => {
  it("GET '/' -- should fail for non-admin", async () => {
    let { body, status } = await anon.get(userApi);

    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("POST '/' -- should insert a new user", async () => {
    const username = 'user2';

    let { body } = await anon.post(userApi).send({
      username,
      email: 'user2@test.dk',
      password: '123abc'
    });

    expect(body.username).toEqual(username);
    expect(body.password).toBeFalsy();
  });

  it("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await anon.post(userApi).send({
      username: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  it("GET '/:id' -- should fail", async () => {
    let { status, body } = await anon.get(`${userApi}/2`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("GET '/:id/profile?semesterId=1' -- should fail", async () => {
    let { status, body } = await anon.get(`${userApi}/1/profile?semesterId=1`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("PATCH '/:id' -- should fail", async () => {
    let { status, body } = await anon.patch(`${userApi}/1`).send({
      username: 'NewUsername'
    });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("DELETE '/:id' -- should fail", async () => {
    let { status, body } = await anon.delete(`${userApi}/1`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });
});

/*
 ==============================
    TESTS FOR REGULAR USERS
 ==============================
 */
describe('users route: user', () => {
  it("POST '/auth' -- should log a user in", async () => {});

  it("GET '/' -- should fail for user", async () => {
    let { body, status } = await user.get(userApi);

    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("GET '/:id' -- should fail (not owner)", async () => {
    let { status, body } = await anon.get(`${userApi}/1`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("GET '/:id' -- should get one user (owner)", async () => {
    let { body } = await user.get(`${userApi}/2`);

    expect(body.username).toEqual(username);
    expect(body.publicComments).toBeFalsy();
  });

  it("GET '/:id/profile?semesterId=1' -- should fail (not owner)", async () => {
    let { status, body } = await user.get(`${userApi}/1/profile?semesterId=1`);
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("GET '/:id/profile?semesterId=1' -- should get one user profile (owner)", async () => {
    let { body } = await user.get(`${userApi}/2/profile?semesterId=1`);

    expect(body).toHaveProperty('bookmarks');
    expect(body).toHaveProperty('privateComments');
    expect(body).toHaveProperty('publicComments');
    expect(body).toHaveProperty('answers');
    expect(body).toHaveProperty('questions');
  });

  it("PATCH '/:id' -- should fail (not owner)", async () => {
    let { body, status } = await user.patch(`${userApi}/1`).send({
      username: 'NewUsername'
    });
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("PATCH '/:id' -- should patch user", async () => {
    const username = 'user3';

    let { body } = await user.patch(`${userApi}/2`).send({
      username
    });

    expect(body.username).toEqual(username);
  });

  it("DELETE '/:id' -- should fail (not owner)", async () => {
    let { status, body } = await user.delete(`${userApi}/1`);
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("DELETE '/:id' -- should delete a user", async () => {
    let { body } = await user.delete(`${userApi}/2`);
    expect(body.type).toEqual('deleteUser');
  });
});

/*
 ==============================
        TESTS FOR ADMINS
 ==============================
 */
describe('users route: admin', () => {
  it("GET '/' -- should get all users", async () => {
    let response = await admin.get(userApi);
    let users = response.body;

    expect(users.map((user) => user.username)).toEqual(['admin', 'user']);
  });

  it("GET '/:id' -- should get another user", async () => {
    let { body } = await admin.get(`${userApi}/2`);

    expect(body.username).toEqual(username);
    expect(body.publicComments).toBeFalsy();
  });

  it("GET '/:id/profile?semesterId=1' -- should get another user profile", async () => {
    let { body } = await admin.get(`${userApi}/2/profile?semesterId=1`);

    expect(body).toHaveProperty('bookmarks');
    expect(body).toHaveProperty('privateComments');
    expect(body).toHaveProperty('publicComments');
  });

  it("PATCH '/:id' -- should patch another user", async () => {
    let { body } = await admin.patch(`${userApi}/2`).send({
      username: 'NewUsername'
    });
    expect(body.username).toEqual('NewUsername');
  });

  it("DELETE '/:id' -- should delete another user", async () => {
    let { body } = await admin.delete(`${userApi}/2`);
    expect(body.type).toEqual('deleteUser');
  });
});
