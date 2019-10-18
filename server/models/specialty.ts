import BaseModel from './_base_model';
import { Model } from 'objection';
import QuestionSpecialtyVote from './question_specialty_vote';
import Semester from './semester';

class Specialty extends BaseModel {
  static get tableName() {
    return 'questionSpecialty';
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
        modelClass: QuestionSpecialtyVote,
        join: {
          from: 'questionSpecialty.id',
          to: 'questionSpecialtyVote.specialtyId'
        }
      },

      semester: {
        relation: Model.BelongsToOneRelation,
        modelClass: Semester,
        join: {
          from: 'questionSpecialty.semesterId',
          to: 'semester.id'
        }
      }
    };
  }

  static get defaultEager() {
    return '[semester, questions(active)]';
  }
}

module.exports = Specialty;
export default Specialty;
