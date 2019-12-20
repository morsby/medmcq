import Question, { QuestionFilterInput } from './Question';

interface Quiz {}

class Quiz {
  static start = async (filter?: QuestionFilterInput) => {
    await Question.fetch(filter);
  };
}

export default Quiz;
