import client from 'urqlClient';

class API {
  static query = async <A>(name: string, query: any, variables?: { [key: string]: any }) => {
    const res = await client.query(query, variables).toPromise();

    return res.data[name] as A;
  };

  static mutate = async <A>(name: string, mutation: any, variables?: { [key: string]: any }) => {
    const res = await client.mutation(mutation, variables).toPromise();

    return res.data[name] as A;
  };
}

export default API;
