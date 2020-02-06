import { QuestionFilterInput } from './Question';
import { store } from 'IndexApp';
import selectionReducer from 'redux/reducers/selection';

interface Selection {}

class Selection {
  static change = (data: { type: keyof QuestionFilterInput | 'type'; value: any }) => {
    store.dispatch(selectionReducer.actions.changeSelection(data));
  };
}

export default Selection;
