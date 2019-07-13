const request = require('supertest');
const server = require('../../server');
const authApi = '/api/auth';

// For at gemme sessions
const agent = request.agent(server);

describe('auth route', () => {
  test("POST '/' -- should log a new user in", async () => {
    let req = await agent
      .post(authApi)
      .send({ username: 'TestAdmin', password: 'TestPassword123' });
    let { type } = req.body;

    expect(type).toEqual('LoginSuccess');
  });

  test("GET '/' -- should get the logged in user", async () => {
    let response = await agent.get(authApi);

    let res = response.body;
    expect(res.username).toEqual('TestAdmin');
  });

  test("GET '/logout' -- should logout", async () => {
    let response = await agent.get(`${authApi}/logout`);

    let res = response.body;
    expect(res.type).toEqual('LogoutSuccess');
  });

  test("POST '/' -- should fail with wrong password", async () => {
    const { body } = await agent.post(authApi).send({
      username: 'Should fail',
      password: 'Wrong pass'
    });

    expect(body.type).toEqual('LoginFailed');
  });
});
