import Question from './Question';
import { store } from 'IndexApp';
import quizReducer from 'redux/reducers/quiz';
import { ReduxState } from 'redux/reducers';
import gql from 'graphql-tag';
import API from './API.class';
import { UserAnswerInput, QuestionFilterInput } from 'types/generated';

interface Quiz {}

class Quiz {
  static start = async (filter?: Partial<QuestionFilterInput>, examMode?: boolean) => {
    const reduxStore: ReduxState = store.getState() as any;
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
        case 'metadata':
          filter = { ...rootFilter, tagIds, specialtyIds };
          break;
        case 'set':
          filter = { ...rootFilter, examSetId };
          break;
        default:
          filter = rootFilter;
      }
    }

    if (examMode) {
      store.dispatch(quizReducer.actions.startExamMode());
    } else {
      store.dispatch(quizReducer.actions.stopExamMode());
    }
    filter = { ...filter, onlyNew, onlyWrong };
    await Question.fetch(filter, true);
  };

  static answer = async (data: UserAnswerInput, answerIds: number[], examMode?: boolean) => {
    const { answerId, answerTime } = data;
    const mutation = gql`
      mutation($data: UserAnswerInput!) {
        answer(data: $data)
      }
    `;

    if (!examMode) API.mutate('answer', mutation, { data });
    store.dispatch(quizReducer.actions.answer({ answer: { answerId, answerTime }, answerIds }));
  };

  static stopExam = async () => {
    const state: ReduxState = store.getState() as any;

    for (let answer of state.quiz.userAnswers) {
      await Quiz.answer({ answerId: answer.answerId, answerTime: answer.answerTime }, [], false);
    }

    store.dispatch(quizReducer.actions.stopExamMode());
    store.dispatch(quizReducer.actions.changeQuestion(0));
  };
}

export default Quiz;
