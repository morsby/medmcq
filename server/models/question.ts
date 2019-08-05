import BaseModel, { CustomQueryBuilder, modifiers } from './_base_model';
import { Model } from 'objection';
import QuestionBookmark from './question_bookmark';
import ExamSet from './exam_set';
import Semester from './semester';
import QuestionComment from './question_comment';
import QuestionCorrectAnswer from './question_correct_answer';

class Question extends BaseModel {
  readonly id!: number;
  oldId: string;
  text: string;
  image: string;
  answer1: string;
  answer2: string;
  answer3: string;
  examSetQno: number;
  examSetId: number;

  examSet: ExamSet;
  semester: Semester;
  publicComments: [QuestionComment];
  privateComments: [QuestionComment];
  correctAnswers: [QuestionCorrectAnswer];

  static get tableName() {
    return 'question';
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'text',
        'answer1',
        'answer2',
        'answer3',
        // TODO pre-migration: Migration Skal tilføje comment på examSetQno
        'examSetQno',
        'examSetId'
      ],

      properties: {
        id: { type: 'integer' },
        oldId: { type: 'string' },
        text: { type: 'string' },
        image: { type: 'string' },
        answer1: { type: 'string' },
        answer2: { type: 'string' },
        answer3: { type: 'string' },
        examSetQno: { type: 'integer' },
        examSetId: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    const ExamSet = require('./exam_set');
    const Semester = require('./semester');
    const QuestionComment = require('./question_comment');
    const QuestionCorrectAnswer = require('./question_correct_answer');
    const QuestionSpecialtyVote = require('./question_specialty_vote');
    const QuestionTagVote = require('./question_tag_vote');
    return {
      specialties: {
        relation: Model.HasManyRelation,
        modelClass: QuestionSpecialtyVote,
        join: {
          from: 'questionSpecialtyVote.questionId',
          to: 'question.id'
        }
      },

      tags: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagVote,
        join: {
          from: 'questionTagVote.questionId',
          to: 'question.id'
        }
      },

      examSet: {
        relation: Model.BelongsToOneRelation,
        modelClass: ExamSet,
        join: {
          from: 'question.examSetId',
          to: 'semesterExamSet.id'
        }
      },

      semester: {
        relation: Model.HasOneThroughRelation,
        modelClass: Semester,
        join: {
          from: 'question.examSetId',
          through: {
            from: 'semesterExamSet.id',
            to: 'semesterExamSet.semesterId'
          },
          to: 'semester.id'
        }
      },

      correctAnswers: {
        relation: Model.HasManyRelation,
        modelClass: QuestionCorrectAnswer,
        join: {
          from: 'questionCorrectAnswer.questionId',
          to: 'question.id'
        }
      },
      publicComments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: 'questionComment.questionId',
          to: 'question.id'
        },
        modify: (builder) => builder.where({ private: false })
      },
      privateComments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: 'questionComment.questionId',
          to: 'question.id'
        },
        modify: (builder) => builder.where({ private: true })
      },

      userSpecialtyVotes: {
        relation: Model.HasManyRelation,
        modelClass: QuestionSpecialtyVote,
        join: {
          from: 'questionSpecialtyVote.questionId',
          to: 'question.id'
        }
      },
      userTagVotes: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagVote,
        join: {
          from: 'questionTagVote.questionId',
          to: 'question.id'
        }
      },
      isBookmarked: {
        relation: Model.HasOneRelation,
        modelClass: QuestionBookmark,
        join: {
          from: 'questionBookmark.questionId',
          to: 'question.id'
        }
      }
    };
  }

  static get modifiers() {
    return {
      filterOnMetadata: (builder) => modifiers.filterOnMetadata(builder)
    };
  }

  static get defaultEager() {
    return '[correctAnswers, semester, examSet, publicComments.user, specialties(active), tags(active)]';
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    if (json.semester && Array.isArray(json.semester)) {
      json.semester = json.semester[0].id;
    }

    return json;
  }
}

module.exports = Question;
export default Question;
