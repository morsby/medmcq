import client from '../apolloClient';
import { store } from 'IndexApp';
import makeToast from 'redux/actions/makeToast';

class Apollo {
  static query = async <A>(name: string, query: any, variables?: { [key: string]: any }) => {
    try {
      const res = await client.query({
        query,
        variables
      });

      return res.data[name] as A;
    } catch (error) {
      console.error(error);
      store.dispatch(makeToast('toast.genericError', 'error'));
    }
  };

  static mutate = async <A>(name: string, mutation: any, variables?: { [key: string]: any }) => {
    try {
      const res = await client.mutate({
        mutation,
        variables
      });

      return res.data[name] as A;
    } catch (error) {
      console.error(error);
      store.dispatch(makeToast('toast.genericError', 'error'));
    }
  };
}

export default Apollo;
