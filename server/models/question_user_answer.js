import BaseModel from "./_base_model";
const { Model } = require("objection");

class QuestionUserAnswer extends BaseModel {
  static get tableName() {
    return "questionUserAnswer";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "questionId", "answer"],

      properties: {
        id: { type: "integer" },
        userId: { type: ["integer", "null"] },
        questionId: { type: "integer" },
        answer: { type: "integer" }
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
          from: "questionUserAnswer.userId",
          to: "user.id"
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "questionUserAnswer.questionId",
          to: "question.id"
        }
      }
    };
  }
}

module.exports = QuestionUserAnswer;
