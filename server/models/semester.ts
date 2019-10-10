import BaseModel from './_base_model';
import { Model } from 'objection';
import ExamSet from './exam_set';
import Question from './question';
import Specialty from './specialty';
import Tag from './tag';

interface Semester {
  id: number;
  value: number;
  name: string;
  shortName: string;
}

class Semester extends BaseModel {
  static get tableName() {
    return 'semester';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['value', 'name', 'shortName'],

      properties: {
        id: { type: 'integer' },
        value: { type: 'integer', minimum: 7, maximum: 12 },
        name: { type: 'string', minLength: 3 },
        shortName: { type: 'string', minLength: 3, maxLength: 10 }
      }
    };
  }

  static get relationMappings() {
    return {
      examSets: {
        relation: Model.HasManyRelation,
        modelClass: ExamSet,
        join: {
          from: 'semester.id',
          to: 'semesterExamSet.semesterId'
        }
      },
      questions: {
        relation: Model.ManyToManyRelation,
        modelClass: Question,
        join: {
          from: 'semester.id',
          through: {
            from: 'semesterExamSet.semesterId',
            to: 'semesterExamSet.id'
          },
          to: 'question.examSetId'
        }
      },
      specialties: {
        relation: Model.HasManyRelation,
        modelClass: Specialty,
        join: {
          from: 'questionSpecialty.semesterId',
          to: 'semester.id'
        }
      },
      tags: {
        relation: Model.HasManyRelation,
        modelClass: Tag,
        join: {
          from: 'questionTag.semesterId',
          to: 'semester.id'
        }
      }
    };
  }

  static get defaultEager() {
    return '[examSets, specialties.questions(active), tags.questions(active)]';
  }

  $formatJson(json) {
    json = super.$formatJson(json);

    // Vi tjekker om specialties er et array (og nester en masse for at undgå undefined errs)
    if (Array.isArray(((json.specialties || [{}])[0] || {}).questions)) {
      json.specialties = json.specialties.map((specialty) => ({
        ...specialty,
        questionCount: specialty.questions.length,
        questions: undefined
      }));
    }
    // Vi tjekker om tags er et array (og nester en masse for at undgå undefined errs)
    if (Array.isArray(((json.tags || [{}])[0] || {}).questions)) {
      json.tags = json.tags.map((specialty) => ({
        ...specialty,
        questionCount: specialty.questions.length,
        questions: undefined
      }));
    }
    return json;
  }
}

module.exports = Semester;
export default Semester;
