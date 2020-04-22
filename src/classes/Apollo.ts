import client from '../apolloClient';

class Apollo {
  static query = async <A>(name: string, query: any, variables?: { [key: string]: any }) => {
    const res = await client.query({
      query,
      variables
    });

    return res.data[name] as A;
  };

  static mutate = async <A>(name: string, mutation: any, variables?: { [key: string]: any }) => {
    const res = await client.mutate({
      mutation,
      variables
    });

    return res.data[name] as A;
  };
}

export default Apollo;
