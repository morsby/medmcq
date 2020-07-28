import { createClient, dedupExchange, fetchExchange } from 'urql';
import { retryExchange } from '@urql/exchange-retry';
import { suspenseExchange } from '@urql/exchange-suspense';

const client = createClient({
  url: '/graphql',
  exchanges: [dedupExchange, suspenseExchange, retryExchange({}), fetchExchange],
  suspense: true,
  fetchOptions: {}
});

export default client;
