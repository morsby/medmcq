import { Model } from 'objection';

class QuestionCommentLike extends Model {
  static tableName = 'questionCommentLike';
  static idColumn = ['commentId', 'userId'];
}

export default QuestionCommentLike;
