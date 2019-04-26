import BaseModel, {
  hiddenCols,
  CustomQueryBuilder,
  modifiers
} from "./_base_model";
const { Model } = require("objection");

class QuestionComment extends BaseModel {
  static get tableName() {
    return "questionComment";
  }

  static get hidden() {
    return ["oldId", "private"];
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "questionId", "text"],

      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        question_id: { type: "integer" },
        text: { type: "string" },
        private: { type: "boolean" },
        created_at: { type: "string" }
      }
    };
  }
  static get relationMappings() {
    const Question = require("./question");
    const User = require("./user");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "questionComment.userId",
          to: "user.id"
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "questionComment.questionId",
          to: "question.id"
        }
      }
    };
  }

  static get modifiers() {
    return {
      own: builder => modifiers.belongsToUser(builder)
    };
  }
}

module.exports = QuestionComment;
