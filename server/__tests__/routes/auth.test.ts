import request from 'supertest';
import User from '../../models/user';
import UserRole from '../../models/user_role';
const authApi = '/api/auth';
let server;
let agent;

let username = 'abc';
let password = '123abc';

describe('auth route', () => {
  beforeEach(async () => {
    // Setup server
    server = require('../../server');
    agent = request.agent(server);

    // Create User
    await UserRole.query().insert({
      name: 'user',
      id: 4,
      level: 1
    });
    await User.query().insert({
      username,
      password
    });

    // Login before each test
    let res = await agent.post(authApi).send({ username, password });
    let { type } = res.body;

    expect(type).toEqual('LoginSuccess');
  });

  afterEach(async () => {
    // Cleanup
    await UserRole.query().delete();
    await User.query().delete();
    server.close();
  });

  it('should get the logged in user', async () => {
    let response = await agent.get(authApi);

    let res = response.body;
    expect(res.username).toEqual(username);
  });

  it('should logout', async () => {
    let response = await agent.get(`${authApi}/logout`);

    let res = response.body;
    expect(res.type).toEqual('LogoutSuccess');
  });

  it('should fail with wrong password', async () => {
    const { body } = await agent.post(authApi).send({
      username: 'Should fail',
      password: 'Wrong pass'
    });

    expect(body.type).toEqual('LoginFailed');
  });
});
