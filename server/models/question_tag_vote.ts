import { Model } from 'objection';

interface QuestionTagVote {
  id: number;
  userId: number;
  questionId: number;
  tagId: number;
  value: number;
}

class QuestionTagVote extends Model {
  static get tableName() {
    return 'questionTagVote';
  }
}

module.exports = QuestionTagVote;
export default QuestionTagVote;
