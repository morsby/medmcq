import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

export default new ApolloServer({
  schema,
  // Context indeholder req.user fra express. Kan bruges til at begrænse adgang, ejerskab mm.
  context: ({ req }) => {
    const { user } = req;
    return { user };
  }
});
