import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './schema';
import generateLoaders from './dataloaders/index';

export type Context = ReturnType<typeof generateLoaders>;

export default new ApolloServer({ resolvers, typeDefs, context: () => generateLoaders() });
