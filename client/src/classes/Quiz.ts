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

  static answer = async (data: AnswerInput, examMode: boolean) => {
    const { questionId, answer, answerTime } = data;
    const mutation = gql`
      mutation($data: AnswerInput!) {
        answer(data: $data)
      }
    `;

    if (!examMode) Apollo.mutate('answer', mutation, { data });
    await store.dispatch(quizReducer.actions.answer({ questionId, answer, answerTime }));
  };

  static stopExam = async () => {
    const state: ReduxState = store.getState() as any;

    for (let answer of state.quiz.answers) {
      await Quiz.answer(
        { questionId: answer.questionId, answer: answer.answer, answerTime: answer.answerTime },
        false
      );
    }

    store.dispatch(quizReducer.actions.stopExamMode());
    store.dispatch(quizReducer.actions.changeQuestion(0));
  };
}

export default Quiz;
