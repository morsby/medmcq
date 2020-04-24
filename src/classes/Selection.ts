import { store } from 'IndexApp';
import selectionReducer from 'redux/reducers/selection';
import { QuestionFilterInput, ContactInput } from 'types/generated';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import settingsReducer from 'redux/reducers/settings';

interface Selection {}

class Selection {
  static change = (data: { type: keyof QuestionFilterInput | 'type'; value: any }) => {
    store.dispatch(selectionReducer.actions.changeSelection(data));
  };

  static contact = async (data: ContactInput) => {
    const mutation = gql`
      mutation Contact($data: ContactInput) {
        contact(data: $data)
      }
    `;

    await Apollo.mutate('contact', mutation, { data });
  };

  static fetchNotice = async () => {
    const query = gql`
      query {
        notice {
          message
          color
        }
      }
    `;

    const notice = await Apollo.query<{ message: string; color: string }>('notice', query);
    store.dispatch(settingsReducer.actions.setNotice(notice));
  };

  static fetchMaintenance = async () => {
    const query = gql`
      query {
        maintenance {
          message
        }
      }
    `;

    const maintenance = await Apollo.query<{ message: string }>('maintenance', query);
    store.dispatch(settingsReducer.actions.setMaintenance(maintenance));
  };
}

export default Selection;
