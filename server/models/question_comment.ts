import { Model } from 'objection';

interface QuestionComment {
  id: number;
  userId: number;
  questionId: number;
  text: string;
  private: 0 | 1;
  anonymous: 0 | 1;
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

  $beforeInsert() {
    this.createdAt = new Date();
  }
}

export default QuestionComment;
