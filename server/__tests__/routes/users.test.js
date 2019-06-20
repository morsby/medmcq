const request = require('supertest');
const server = require('../../server');
const userApi = '/api/users';

const admin = request.agent(server);
const user = request.agent(server);
const anon = request.agent(server);
// Settings vars to reuse across tests
let newUserId, adminId, userIds;

beforeAll(async () => {
  let res = await admin
    .post('/api/auth')
    .send({ username: 'TestAdmin', password: 'TestPassword123' });

  adminId = res.id;
});

afterEach(() => {
  server.close();
});

/*
 ==============================
       TESTS FOR ANONS
 ==============================
 */
describe('users route: not logged in', () => {
  test("GET '/' -- should fail for non-admin", async () => {
    let { body, status } = await anon.get(userApi);

    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("POST '/' -- should insert a new user", async () => {
    let { body } = await anon.post(userApi).send({
      username: 'TestPost',
      email: 'test@post.dk',
      password: 'TestPassword123'
    });

    await anon.post(userApi).send({
      username: 'TestPost2',
      password: 'TestPassword123'
    });

    userIds = [body.id, body.id + 1];
    expect(body.username).toEqual('TestPost');
    expect(body.password).toBeFalsy();
  });

  test("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await anon.post(userApi).send({
      username: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  test("GET '/:id' -- should fail", async () => {
    let { status, body } = await anon.get(`${userApi}/${userIds[0]}`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("GET '/:id/profile?semesterId=1' -- should fail", async () => {
    let { status, body } = await anon.get(`${userApi}/${newUserId}/profile?semesterId=1`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("PATCH '/:id' -- should fail", async () => {
    let { status, body } = await anon.patch(`${userApi}/${newUserId}`).send({
      username: 'NewUsername'
    });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("DELETE '/:id' -- should fail", async () => {
    let { status, body } = await anon.delete(`${userApi}/${newUserId}`);

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
  test("POST '/auth' -- should log a user in", async () => {
    let { body } = await user
      .post('/api/auth')
      .send({ username: 'TestPost', password: 'TestPassword123' });

    expect(body.data.username).toEqual('TestPost');
  });

  test("GET '/' -- should fail for user", async () => {
    let { body, status } = await user.get(userApi);

    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("GET '/:id' -- should fail (not owner)", async () => {
    let { status, body } = await anon.get(`${userApi}/${adminId}`);

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("GET '/:id' -- should get one user (owner)", async () => {
    let { body } = await user.get(`${userApi}/${userIds[0]}`);

    expect(body.username).toEqual('TestPost');
    expect(body.publicComments).toBeFalsy();
  });

  test("GET '/:id/profile?semesterId=1' -- should fail (not owner)", async () => {
    let { status, body } = await user.get(`${userApi}/${adminId}/profile?semesterId=1`);
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("GET '/:id/profile?semesterId=1' -- should get one user profile (owner)", async () => {
    let { body } = await user.get(`${userApi}/${userIds[0]}/profile?semesterId=1`);

    expect(body).toHaveProperty('bookmarks');
    expect(body).toHaveProperty('privateComments');
    expect(body).toHaveProperty('publicComments');
    expect(body).toHaveProperty('answers');
    expect(body).toHaveProperty('questions');
  });

  test("PATCH '/:id' -- should fail (not owner)", async () => {
    let { body, status } = await user.patch(`${userApi}/${adminId}`).send({
      username: 'NewUsername'
    });
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("PATCH '/:id' -- should patch user", async () => {
    let { body } = await user.patch(`${userApi}/${userIds[0]}`).send({
      username: 'TestBruger2'
    });
    expect(body.username).toEqual('TestBruger2');
  });

  test("DELETE '/:id' -- should fail (not owner)", async () => {
    let { status, body } = await user.delete(`${userApi}/${adminId}`);
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("DELETE '/:id' -- should delete a user", async () => {
    let { body } = await user.delete(`${userApi}/${userIds[0]}`);
    expect(body.type).toEqual('deleteUser');
  });
});

/*
 ==============================
        TESTS FOR ADMINS
 ==============================
 */
describe('users route: admin', () => {
  test("GET '/' -- should get all users", async () => {
    let response = await admin.get(userApi);
    let users = response.body;

    expect(users.map((user) => user.username)).toEqual([
      'TestAdmin',
      'TestEditor',
      'TestBruger',
      'TestPost2'
    ]);
  });

  test("GET '/:id' -- should get another user", async () => {
    let { body } = await admin.get(`${userApi}/${userIds[1]}`);

    expect(body.username).toEqual('TestPost2');
    expect(body.publicComments).toBeFalsy();
  });

  test("GET '/:id/profile?semesterId=1' -- should get another user profile", async () => {
    let { body } = await admin.get(`${userApi}/${userIds[1]}/profile?semesterId=1`);

    expect(body).toHaveProperty('bookmarks');
    expect(body).toHaveProperty('privateComments');
    expect(body).toHaveProperty('publicComments');
  });

  test("PATCH '/:id' -- should patch another user", async () => {
    let { body } = await admin.patch(`${userApi}/${userIds[1]}`).send({
      username: 'NewUsername'
    });
    expect(body.username).toEqual('NewUsername');
  });

  test("DELETE '/:id' -- should delete another user", async () => {
    let { body } = await admin.delete(`${userApi}/${userIds[1]}`);
    expect(body.type).toEqual('deleteUser');
  });
});
