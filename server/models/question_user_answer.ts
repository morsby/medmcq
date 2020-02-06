import { Model } from 'objection';

interface QuestionUserAnswer {
  id: number;
  answer: number;
  questionId: number;
  userId: number;
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
