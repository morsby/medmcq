import BaseModel from "./_base_model";
const { Model } = require("objection");

class UserRole extends BaseModel {
  static get tableName() {
    return "userRole";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "level"],

      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        level: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    const User = require("./user");

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "user.roleId",
          to: "userRole.id"
        }
      }
    };
  }
}

module.exports = UserRole;
