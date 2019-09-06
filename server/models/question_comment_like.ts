import { Model } from 'objection';

class QuestionCommentLike extends Model {
  static tableName = 'question_comment_like';
  static idColumn = ['user_id', 'comment_id'];
}

export default QuestionCommentLike;
