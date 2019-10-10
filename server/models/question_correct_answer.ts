import BaseModel from './_base_model';
import { Model } from 'objection';
import Question from './question';

interface QuestionCorrectAnswer {
  id: number;
  answer: number;
  questionId: number;
}

class QuestionCorrectAnswer extends BaseModel {
  static get tableName() {
    return 'questionCorrectAnswer';
  }
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['questionId', 'answer'],

      properties: {
        id: { type: 'integer' },
        answer: { type: 'integer', minimum: 1, maximum: 3 },
        question_id: { type: 'integer' }
      }
    };
  }
  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionCorrectAnswer.questionId',
          to: 'question.id'
        }
      }
    };
  }
  $formatJson(json) {
    json = super.$formatJson(json);

    // Flattens correctAnswers (omits id and questionId)
    json = json.answer;

    return json;
  }
}

module.exports = QuestionCorrectAnswer;
export default QuestionCorrectAnswer;
