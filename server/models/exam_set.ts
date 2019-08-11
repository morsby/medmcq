import BaseModel from './_base_model';
import { Model } from 'objection';

/**
 * The model for an exam set.
 * @extends BaseModel
 */
class ExamSet extends BaseModel {
  id: number;
  season: string;
  year: number;
  semesterId: number;

  /**
   * The name of the table in the database
   * @type {String}
   */
  static get tableName() {
    return 'semesterExamSet';
  }

  /**
   * The jsonSchema for the exam set.
   * This performs validation and gives GraphQL properties.
   * @type {object}
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['year', 'season', 'semesterId'],

      properties: {
        id: { type: 'integer' },
        year: { type: 'integer', minimum: 2010, maximum: 2100 },
        season: { type: 'string', pattern: '^[EF]$' },
        semesterId: { type: 'integer' }
      }
    };
  }

  /**
   * All relations for the exam set
   * @type {object}
   */
  static get relationMappings() {
    const Question = require('./question');
    const Semester = require('./semester');

    return {
      semester: {
        relation: Model.BelongsToOneRelation,
        modelClass: Semester,
        join: {
          from: 'semesterExamSet.semesterId',
          to: 'semester.id'
        }
      },
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'question.examSetId',
          to: 'semesterExamSet.id'
        }
      }
    };
  }
}

module.exports = ExamSet;
export default ExamSet;
