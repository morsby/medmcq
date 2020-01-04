import Question, { QuestionFilterInput } from './Question';
import { store } from 'IndexApp';
import quizReducer from 'redux/reducers/quiz';
import { ReduxState } from 'redux/reducers';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';

interface Quiz {}

export interface AnswerInput {
  questionId: number;
  answer: number;
  answerTime: number;
}

class Quiz {
  static start = async (filter?: Partial<QuestionFilterInput>) => {
    const reduxStore: ReduxState = store.getState();
    const {
      specialtyIds,
      tagIds,
      semesterId,
      n,
      examSetId,
      onlyNew,
      onlyWrong,
      search,
      type
    } = reduxStore.selection;

    if (!filter) {
      const rootFilter = { semesterId, n };

      switch (type) {
        case 'random':
          filter = { ...rootFilter, search };
          break;
        case 'specialer':
          filter = { ...rootFilter, tagIds, specialtyIds };
          break;
        case 'set':
          filter = { ...rootFilter, examSetId };
          break;
        default:
          filter = rootFilter;
      }
    }

    filter = { ...filter, onlyNew, onlyWrong };
    await Question.fetch(filter, true);
  };

  static answer = async (data: AnswerInput) => {
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
