import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from 'graphql/types';
import generateLoaders from './dataloaders';

export type Context = ReturnType<typeof generateLoaders>;

export default new ApolloServer({ resolvers, typeDefs, context: () => generateLoaders() });
