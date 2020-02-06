import { Model } from 'objection';
import Question from './question';

interface QuestionCorrectAnswer {
  id: number;
  answer: number;
  questionId: number;
}

class QuestionCorrectAnswer extends Model {
  static get tableName() {
    return 'questionCorrectAnswer';
  }
}

export default QuestionCorrectAnswer;
