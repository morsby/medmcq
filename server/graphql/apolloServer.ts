import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

export default new ApolloServer({ schema });
