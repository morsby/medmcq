import { Model } from 'objection';

interface QuestionComment {
  id: number;
  userId: number;
  questionId: number;
  text: string;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class QuestionComment extends Model {
  static get tableName() {
    return 'questionComment';
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export default QuestionComment;
