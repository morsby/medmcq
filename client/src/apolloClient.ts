import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: '/graphql'
});

client.defaultOptions = {
  query: {
    fetchPolicy: 'network-only'
  }
};

export default client;
