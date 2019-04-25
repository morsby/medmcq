import BaseModel, { CustomQueryBuilder, modifiers } from "./_base_model";
const { Model } = require("objection");

class QuestionTagVote extends BaseModel {
  static get tableName() {
    return "questionTagVote";
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "questionId", "tagId"],

      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        questionId: { type: "integer" },
        tagId: { type: "integer" }
      }
    };
  }
  static get relationMappings() {
    const Question = require("./question");
    const User = require("./user");
    const Tag = require("./tag");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "questionTagVote.userId",
          to: "user.id"
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "questionTagVote.questionId",
          to: "question.id"
        }
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tag,
        join: {
          from: "questionTagVote.tagId",
          to: "questionTag.id"
        }
      }
    };
  }
  static get modifiers() {
    return {
      active: builder => modifiers.activeMetadata(builder),
      own: builder => modifiers.belongsToUser(builder),
      joinTag: builder =>
        builder
          .joinRelation("tag")
          .select("questionTagVote.*", "tag.name as name")
    };
  }
}

module.exports = QuestionTagVote;
