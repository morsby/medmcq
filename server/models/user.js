import _ from "lodash";
import BaseModel, { hiddenCols } from "./_base_model";

const { Model } = require("objection");
const Password = require("objection-password")({
  rounds: 10
});

// TODO: pre-migration: Password skal slåes fra under migrering

class User extends Password(BaseModel) {
  static get hidden() {
    return [
      ...hiddenCols,
      "password",
      "resetPasswordToken",
      "resetPasswordExpires"
    ];
  }

  static get tableName() {
    return "user";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "password"],

      properties: {
        id: { type: "integer" },
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
        resetPasswordExpires: { type: ["integer", "null"] },
        resetPasswordToken: { type: ["string", "null"] },
        oldId: { type: "string" },
        roleId: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    const QuestionComment = require("./question_comment");
    const QuestionBookmark = require("./question_bookmark");
    const QuestionUserAnswer = require("./question_user_answer");
    const UserRole = require("./user_role");
    const SpecialtyVote = require("./question_specialty_vote");
    const TagVote = require("./question_tag_vote");

    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: "questionComment.userId",
          to: "user.id"
        }
      },

      publicComments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: "questionComment.userId",
          to: "user.id"
        },
        modify: builder => builder.where({ private: false })
      },
      privateComments: {
        relation: Model.HasManyRelation,
        modelClass: QuestionComment,
        join: {
          from: "questionComment.userId",
          to: "user.id"
        },
        modify: builder => builder.where({ private: true })
      },

      bookmarks: {
        relation: Model.HasManyRelation,
        modelClass: QuestionBookmark,
        join: {
          from: "questionBookmark.userId",
          to: "user.id"
        }
      },

      answers: {
        relation: Model.HasManyRelation,
        modelClass: QuestionUserAnswer,
        join: {
          from: "questionUserAnswer.userId",
          to: "user.id"
        }
      },

      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserRole,
        join: {
          from: "user.roleId",
          to: "userRole.id"
        },
        modify: builder => builder.select("id", "name")
      },

      specialtyVotes: {
        relation: Model.HasManyRelation,
        modelClass: SpecialtyVote,
        join: {
          from: "questionSpecialtyVote.userId",
          to: "user.id"
        }
      },
      tagVotes: {
        relation: Model.HasManyRelation,
        modelClass: TagVote,
        join: {
          from: "questionTagVote.userId",
          to: "user.id"
        }
      }
    };
  }

  // TODO: Flyt dette ud af formatJson og ind i SQL?
  $formatJson(json) {
    json = super.$formatJson(json);
    if (json.answers) {
      let grouped = _.groupBy(json.answers, "questionId");

      json.answers = _.uniqBy(json.answers, "questionId");

      json.answers = json.answers.map(question => ({
        question: question.question,
        performance: {
          tries: grouped[question.questionId].length,
          correct: (
            _.filter(grouped[question.questionId], { correct: 1 }) || []
          ).length,
          answers: (question.answers || []).concat(
            grouped[question.questionId].map(ans => ans.answer)
          )
        }
      }));
    }

    return json;
  }
}

module.exports = User;
