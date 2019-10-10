import BaseModel, { CustomQueryBuilder, modifiers } from './_base_model';
import { Model } from 'objection';
import Question from './question';
import User from './user';
import Specialty from './specialty';

class QuestionSpecialtyVote extends BaseModel {
  static get tableName() {
    return 'questionSpecialtyVote';
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'questionId', 'specialtyId', 'value'],

      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        questionId: { type: 'integer' },
        specialtyId: { type: 'integer' },
        value: { type: 'number', minimum: -1, maximum: 1 }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'questionSpecialtyVote.userId',
          to: 'user.id'
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionSpecialtyVote.questionId',
          to: 'question.id'
        }
      },
      specialty: {
        relation: Model.BelongsToOneRelation,
        modelClass: Specialty,
        join: {
          from: 'questionSpecialtyVote.specialtyId',
          to: 'questionSpecialty.id'
        }
      }
    };
  }

  static get modifiers() {
    return {
      active: (builder) => modifiers.activeMetadata(builder),
      own: (builder) => modifiers.belongsToUser(builder),
      joinSpecialty: (builder) =>
        builder
          .joinRelation('specialty')
          .select('questionSpecialtyVote.*', 'specialty.name as name')
    };
  }
}

module.exports = QuestionSpecialtyVote;
export default QuestionSpecialtyVote;
