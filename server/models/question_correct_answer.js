import BaseModel from "./_base_model";
const { Model } = require("objection");
class QuestionCorrectAnswer extends BaseModel {
  static get tableName() {
    return "questionCorrectAnswer";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["questionId", "answer"],

      properties: {
        id: { type: "integer" },
        answer: { type: "integer", minimum: 1, maximum: 3 },
        question_id: { type: "integer" }
      }
    };
  }
  static get relationMappings() {
    const Question = require("./question");

    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "questionCorrectAnswer.questionId",
          to: "question.id"
        }
      }
    };
  }
}

module.exports = QuestionCorrectAnswer;
