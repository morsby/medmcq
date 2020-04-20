import { store } from 'IndexApp';
import selectionReducer from 'redux/reducers/selection';
import { QuestionFilterInput, ContactInput } from 'types/generated';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';

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
}

export default Selection;
