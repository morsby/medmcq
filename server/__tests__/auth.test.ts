import User from '../models/user';
import UserRole from '../models/user_role';
import { resolvers, typeDefs } from '../graphql/types';
import { ApolloServer, gql } from 'apollo-server-express';
import { generateContext } from '../graphql/apolloServer';
import { createTestClient } from 'apollo-server-testing';
import express from 'express';
import cookieParser from 'cookie-parser';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile';

// Database
const knex = Knex(knexConfig);
Model.knex(knex);

let app, query, mutate;
const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req, res }) => generateContext(req, res)
});

let username = 'abc';
let password = '123abc';

describe('auth route', () => {
  beforeEach(async () => {
    // Setup server
    app = express();
    app.use(cookieParser());
    apolloServer.applyMiddleware({ app });
    const result = createTestClient(apolloServer as any);
    app.listen(0);
    query = result.query;
    mutate = result.mutate;

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
  });

  afterEach(async () => {
    // Cleanup
    await UserRole.query().delete();
    await User.query().delete();
    app.close();
  });

  it('should login', async () => {
    const result = await mutate({
      mutation: gql`
        mutation($data: LoginInput) {
          login(data: $data)
        }
      `,
      variables: { data: { username, password } }
    });

    console.log(result);
  });

  // it('should get the logged in user', async () => {
  //   let response = await agent.get(authApi);

  //   let res = response.body;
  //   expect(res.username).toEqual(username);
  // });

  // it('should logout', async () => {
  //   let response = await agent.get(`${authApi}/logout`);

  //   let res = response.body;
  //   expect(res.type).toEqual('LogoutSuccess');
  // });

  // it('should fail with wrong password', async () => {
  //   const { body } = await agent.post(authApi).send({
  //     username: 'Should fail',
  //     password: 'Wrong pass'
  //   });

  //   expect(body.type).toEqual('LoginFailed');
  // });
});
