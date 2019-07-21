import BaseModel from './_base_model';
import { Model } from 'objection';

interface QuestionBookmark {
  id: number;
  userId: number;
  questionId: number;
}

class QuestionBookmark extends BaseModel {
  static get tableName() {
    return 'questionBookmark';
  }
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'questionId'],

      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        questionId: { type: 'integer' }
      }
    };
  }
  static get relationMappings() {
    const Question = require('./question');
    const User = require('./user');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'questionBookmark.userId',
          to: 'user.id'
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionBookmark.questionId',
          to: 'question.id'
        }
      }
    };
  }
}

module.exports = QuestionBookmark;
export default QuestionBookmark;
