import { Model } from 'objection';
import Question from './question';
import User from './user';

interface QuestionBookmark {
  id: number;
  userId: number;
  questionId: number;
}

class QuestionBookmark extends Model {
  static get tableName() {
    return 'questionBookmark';
  }
}

export default QuestionBookmark;
