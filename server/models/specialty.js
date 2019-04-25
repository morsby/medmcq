import BaseModel from "./_base_model";
const { Model } = require("objection");

class Specialty extends BaseModel {
  static get tableName() {
    return "questionSpecialty";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "semesterId"],

      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        semesterId: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    const QuestionSpecialtyVote = require("./question_specialty_vote");
    const Semester = require("./semester");

    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: QuestionSpecialtyVote,
        join: {
          from: "questionSpecialty.id",
          to: "questionSpecialtyVote.specialtyId"
        }
      },

      semester: {
        relation: Model.BelongsToOneRelation,
        modelClass: Semester,
        join: {
          from: "questionSpecialty.semesterId",
          to: "semester.id"
        }
      }
    };
  }

  static get defaultEager() {
    return "[semester, questions(active)]";
  }
}

module.exports = Specialty;
