import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from 'graphql/types';
import generateLoaders from './dataloaders';
import jsonWebToken from 'jsonwebtoken';
import User from 'models/user';
import Express from 'express';
const secret = process.env.SECRET || '';

const decodeUser = (jwt: string) => {
  if (!jwt) return null;
  return jsonWebToken.verify(jwt, secret);
};

const generateContext = (req: Express.Request, res: Express.Response) => ({
  ...generateLoaders(),
  user: decodeUser(req.cookies.user) as User,
  res,
  req
});

export type Context = ReturnType<typeof generateContext>;

export default new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req, res }) => generateContext(req, res),
  tracing: true
});
