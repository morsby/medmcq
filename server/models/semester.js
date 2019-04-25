import BaseModel from "./_base_model";
const { Model } = require("objection");

class Semester extends BaseModel {
  static get tableName() {
    return "semester";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["value", "name", "shortName"],

      properties: {
        id: { type: "integer" },
        value: { type: "integer", minimum: 7, maximum: 12 },
        name: { type: "string", minLength: 3 },
        shortName: { type: "string", minLength: 3, maxLength: 10 }
      }
    };
  }

  static get relationMappings() {
    const ExamSet = require("./exam_set");
    const Question = require("./question");
    const Specialty = require("./specialty");
    const Tag = require("./tag");

    return {
      examSets: {
        relation: Model.HasManyRelation,
        modelClass: ExamSet,
        join: {
          from: "semester.id",
          to: "semesterExamSet.semesterId"
        }
      },
      questions: {
        relation: Model.ManyToManyRelation,
        modelClass: Question,
        join: {
          from: "semester.id",
          through: {
            from: "semesterExamSet.semesterId",
            to: "semesterExamSet.id"
          },
          to: "question.examSetId"
        }
      },
      specialties: {
        relation: Model.HasManyRelation,
        modelClass: Specialty,
        join: {
          from: "questionSpecialty.semesterId",
          to: "semester.id"
        }
      },
      tags: {
        relation: Model.HasManyRelation,
        modelClass: Tag,
        join: {
          from: "questionTag.semesterId",
          to: "semester.id"
        }
      }
    };
  }

  static get defaultEager() {
    return "[examSets, specialties.questions(active), tags.questions(active)]";
  }
}

module.exports = Semester;
