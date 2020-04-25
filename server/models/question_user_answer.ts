import { Model } from 'objection';

interface QuestionUserAnswer {
  id: number;
  userId: number;
  answerId: number;
  answerTime: number;
  createdAt: Date;
  updatedAt: Date;
}

class QuestionUserAnswer extends Model {
  static get tableName() {
    return 'questionUserAnswer';
  }
}

export default QuestionUserAnswer;
