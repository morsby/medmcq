import { Model } from 'objection';

interface QuestionIgnores {
  userId: number;
  questionId: number;
}

class QuestionIgnores extends Model {
  static tableName = 'questionIgnores';
  static idColumn = ['userId', 'questionId'];
}

export default QuestionIgnores;
