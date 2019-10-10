import BaseModel, { modifiers, CustomQueryBuilder } from './_base_model';
import { Model } from 'objection';
import Question from './question';
import User from './user';

interface QuestionBookmark {
  id: number;
  userId: number;
  questionId: number;
}

class QuestionBookmark extends BaseModel {
  static get tableName() {
    return 'questionBookmark';
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
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

  static get modifiers() {
    return {
      own: (builder) => modifiers.belongsToUser(builder)
    };
  }

  static get defaultEager() {
    return '[user, question]';
  }
}

module.exports = QuestionBookmark;
export default QuestionBookmark;
