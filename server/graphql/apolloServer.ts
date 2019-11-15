import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from 'graphql/types';
import generateLoaders from './dataloaders';
import User from 'models/user';

export type Context = ReturnType<typeof generateLoaders> & { user: User };

const decodeUser = (jwt) => {
  if (!jwt) return null;
  return jwt.decode(jwt);
};

export default new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req }) => ({ ...generateLoaders(), user: decodeUser(req.cookies.user) })
});
