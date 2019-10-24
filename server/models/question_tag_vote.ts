import BaseModel, { CustomQueryBuilder, modifiers } from './_base_model';
import { Model } from 'objection';
import Question from './question';
import User from './user';
import Tag from './tag';

class QuestionTagVote extends BaseModel {
  static get tableName() {
    return 'questionTagVote';
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'questionId', 'tagId', 'value'],

      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        questionId: { type: 'integer' },
        tagId: { type: 'integer' },
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
          from: 'questionTagVote.userId',
          to: 'user.id'
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionTagVote.questionId',
          to: 'question.id'
        }
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tag,
        join: {
          from: 'questionTagVote.tagId',
          to: 'questionTag.id'
        }
      }
    };
  }
  static get modifiers() {
    return {
      active: (builder) => modifiers.activeMetadata(builder),
      own: (builder) => modifiers.belongsToUser(builder),
      joinTag: (builder) =>
        builder.joinRelation('tag').select('questionTagVote.*', 'tag.name as name')
    };
  }
}

export default QuestionTagVote;
