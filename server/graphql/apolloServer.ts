import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from 'graphql/types';
import generateLoaders from './dataloaders';
import User from 'models/user';
import jsonWebToken from 'jsonwebtoken';

export type Context = ReturnType<typeof generateLoaders> & { user: User };

const decodeUser = (jwt: string) => {
  if (!jwt) return null;
  return jsonWebToken.decode(jwt);
};

export default new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req }) => ({ ...generateLoaders(), user: decodeUser(req.cookies.user) })
});
