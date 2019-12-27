import BaseModel, { hiddenCols } from './_base_model';
import bcrypt from 'bcrypt';
import { Model } from 'objection';
import QuestionCommentLike from './question_comment_like';
import QuestionComment from './question_comment';
import QuestionBookmark from './question_bookmark';
import QuestionUserAnswer from './question_user_answer';
import UserRole from './user_role';
import SpecialtyVote from './question_specialty_vote';
import TagVote from './question_tag_vote';
import ExamSet from './exam_set';

// TODO: pre-migration: Password skal slåes fra under migrering

interface User {
  id: number;
  username: string;
  password: string;
  roleId: number;
}

class User extends BaseModel {
  static get hidden() {
    return [...hiddenCols, 'password', 'resetPasswordToken', 'resetPasswordExpires'];
  }

  static get tableName() {
    return 'user';
  }

  $beforeInsert = async () => {
    this.password = await bcrypt.hash(this.password, 10);
  };

  $beforeUpdate = async () => {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  };

  verifyPassword = (password: string) => {
    return bcrypt.compare(password, this.password);
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        resetPasswordExpires: { type: 'format' },
        resetPasswordToken: { type: ['string', 'null'] },
        oldId: { type: 'string' },
        roleId: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
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
      },
      likes: {
        relation: Model.ManyToManyRelation,
        modelClass: QuestionCommentLike,
        join: {
          from: 'user.id',
          through: {
            from: 'questionComment.userId',
            to: 'questionComment.id'
          },
          to: 'questionCommentLike.commentId'
        }
      }
    };
  }
}

module.exports = User;
export default User;
