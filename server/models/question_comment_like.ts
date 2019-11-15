import { Model } from 'objection';

interface QuestionCommentLike {
  commentId: number;
  userId: number;
}

class QuestionCommentLike extends Model {
  static tableName = 'questionCommentLike';
  static idColumn = ['commentId', 'userId'];
}

export default QuestionCommentLike;
