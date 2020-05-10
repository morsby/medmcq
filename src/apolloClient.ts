import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const link = ApolloLink.from([
  new RetryLink(),
  new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      if (data && data.errors && data.errors.length > 0) {
        throw new Error('GraphQL Operational Error');
      }
      return data;
    });
  }),
  new BatchHttpLink({ uri: '/graphql' })
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
});

export default client;
