import { Model } from 'objection';

interface QuestionUserAnswer {
  id: number;
  questionId: number;
  userId: number;
  answerTime: number;
}

class QuestionUserAnswer extends Model {
  static get tableName() {
    return 'questionUserAnswer';
  }
}

export default QuestionUserAnswer;
