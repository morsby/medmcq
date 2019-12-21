import Question, { QuestionFilterInput } from './Question';
import { store } from 'IndexApp';
import quizReducer from 'redux/reducers/quiz';

interface Quiz {}

class Quiz {
  static start = async (filter?: Partial<QuestionFilterInput>, newQuiz?: boolean) => {
    await Question.fetch(filter);
    if (newQuiz) await store.dispatch(quizReducer.actions.changeQuestion(0));
  };
}

export default Quiz;
