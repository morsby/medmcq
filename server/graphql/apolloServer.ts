import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

import dataloaders from './dataloaders';

export default new ApolloServer({
  schema,
  // Context indeholder req.user fra express. Kan bruges til at begrænse adgang, ejerskab mm.
  context: ({ req }) => {
    const { user } = req;
    return { user, ...dataloaders(user) };
  }
});
