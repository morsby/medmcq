import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'questions', url: 'http://localhost:4001' },
    { name: 'examSets', url: 'http://localhost:4002' },
    { name: 'semesters', url: 'http://localhost:4003' }
    // more services
  ],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        // pass the user's id from the context to underlying services
        // as a header called `user-id`
        request.http.headers.set('user-id', (context['user'] || {}).id);
      }
    });
  }
});

export default new ApolloServer({
  gateway,
  // Context indeholder req.user fra express. Kan bruges til at begrænse adgang, ejerskab mm.
  context: ({ req }) => {
    const { user } = req;
    return { user };
  },
  subscriptions: false
});
