import BaseModel from './_base_model';
import { Model } from 'objection';
import QuestionTagVote from './question_tag_vote';
import Semester from './semester';

class Tag extends BaseModel {
  static get tableName() {
    return 'questionTag';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'semesterId'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        semesterId: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagVote,
        join: {
          from: 'questionTag.id',
          to: 'questionTagVote.tagId'
        }
      },

      semester: {
        relation: Model.BelongsToOneRelation,
        modelClass: Semester,
        join: {
          from: 'questionTag.semesterId',
          to: 'semester.id'
        }
      }
    };
  }

  static get defaultEager() {
    return '[semester, questions(active)]';
  }
}

module.exports = Tag;
export default Tag;
