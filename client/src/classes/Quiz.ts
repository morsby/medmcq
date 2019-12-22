import Question, { QuestionFilterInput } from './Question';
import { store } from 'IndexApp';
import quizReducer from 'redux/reducers/quiz';
import { ReduxState } from 'redux/reducers';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';

interface Quiz {}

export interface Answer {
  questionId: number;
  answer: number;
  answerTime: number;
}

class Quiz {
  static start = async (filter?: Partial<QuestionFilterInput>) => {
    const reduxStore: ReduxState = store.getState();
    const { specialtyIds, tagIds, semesterId, n, setId } = reduxStore.ui.selection;
    console.log('filter', filter);
    if (!filter) {
      filter = { specialtyIds, tagIds, semesterId, n, setId };
    }

    console.log('filter2', filter);

    await Question.fetch(filter, true);
  };

  static answer = async (data: Answer) => {
    const { questionId, answer } = data;
    const mutation = gql`
      mutation($data: AnswerInput!) {
        answer(data: $data)
      }
    `;

    Apollo.mutate('answer', mutation, { data });
    await store.dispatch(quizReducer.actions.answer({ questionId, answer }));
  };
}

export default Quiz;
