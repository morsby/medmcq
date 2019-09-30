import BaseModel, { CustomQueryBuilder, modifiers } from './_base_model';
const { Model } = require('objection');

interface QuestionComment {
  id: number;
  userId: number;
  questionId: number;
  text: string;
  private: boolean;
  updatedAt: Date;
}

class QuestionComment extends BaseModel {
  static get tableName() {
    return 'questionComment';
  }

  static get hidden() {
    return ['oldId', 'private'];
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'questionId', 'text'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        question_id: { type: 'integer' },
        text: { type: 'string' },
        private: { type: 'boolean' },
        created_at: { type: 'string' }
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
          from: 'questionComment.userId',
          to: 'user.id'
        },
        modify: (builder) => builder.select('username', 'id')
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionComment.questionId',
          to: 'question.id'
        }
      }
    };
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static get modifiers() {
    return {
      own: (builder) => modifiers.belongsToUser(builder)
    };
  }
}

module.exports = QuestionComment;
export default QuestionComment;
