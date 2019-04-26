import BaseModel from "./_base_model";
const { Model, ref } = require("objection");

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
    const QuestionCorrectAnswer = require("./question_correct_answer");
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
      },
      correctAnswers: {
        relation: Model.HasManyRelation,
        modelClass: QuestionCorrectAnswer,
        join: {
          from: "questionUserAnswer.questionId",
          to: "questionCorrectAnswer.questionId"
        }
      }
    };
  }
  static get modifiers() {
    return {
      summary: builder =>
        builder.select(
          "*",
          builder
            .modelClass()
            .relatedQuery("correctAnswers")
            .where("correctAnswers.answer", ref("questionUserAnswer.answer"))
            .count("*")
            .as("correct")
        )
    };
  }
}

module.exports = QuestionUserAnswer;
