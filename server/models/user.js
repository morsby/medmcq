import BaseModel, { hiddenCols } from './_base_model';

const { Model } = require('objection');
const Password = require('objection-password')({
  rounds: 10
});

// TODO: pre-migration: Password skal slåes fra under migrering

class User extends Password(BaseModel) {
  static get hidden() {
    return [...hiddenCols, 'password', 'resetPasswordToken', 'resetPasswordExpires'];
  }

  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        resetPasswordExpires: { type: ['integer', 'null'] },
        resetPasswordToken: { type: ['string', 'null'] },
        oldId: { type: 'string' },
        roleId: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    const QuestionComment = require('./question_comment');
    const QuestionBookmark = require('./question_bookmark');
    const QuestionUserAnswer = require('./question_user_answer');
    const UserRole = require('./user_role');
    const SpecialtyVote = require('./question_specialty_vote');
    const TagVote = require('./question_tag_vote');
    const ExamSet = require('./exam_set');

    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: 'questionComment.userId',
          to: 'user.id'
        }
      },

      manualCompletedSets: {
        relation: Model.ManyToManyRelation,
        modelClass: ExamSet,
        join: {
          from: 'user.id',
          through: {
            from: 'manualCompletedSets.userId',
            to: 'manualCompletedSets.setId'
          },
          to: 'semesterExamSet.id'
        }
      },

      publicComments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: 'questionComment.userId',
          to: 'user.id'
        },
        modify: (builder) => builder.where({ private: false })
      },

      privateComments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: 'questionComment.userId',
          to: 'user.id'
        },
        modify: (builder) => builder.where({ private: true })
      },

      bookmarks: {
        relation: Model.HasManyRelation,
        modelClass: QuestionBookmark,
        join: {
          from: 'questionBookmark.userId',
          to: 'user.id'
        }
      },

      answers: {
        relation: Model.HasManyRelation,
        modelClass: QuestionUserAnswer,
        join: {
          from: 'questionUserAnswer.userId',
          to: 'user.id'
        }
      },

      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserRole,
        join: {
          from: 'user.roleId',
          to: 'userRole.id'
        },
        modify: (builder) => builder.select('id', 'name')
      },

      specialtyVotes: {
        relation: Model.HasManyRelation,
        modelClass: SpecialtyVote,
        join: {
          from: 'questionSpecialtyVote.userId',
          to: 'user.id'
        }
      },
      tagVotes: {
        relation: Model.HasManyRelation,
        modelClass: TagVote,
        join: {
          from: 'questionTagVote.userId',
          to: 'user.id'
        }
      }
    };
  }
}

module.exports = User;
