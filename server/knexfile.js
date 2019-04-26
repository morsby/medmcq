const { knexSnakeCaseMappers } = require("objection");
const { devConnection } = require("./config/keys");

let baseConfig = {
  client: "mysql",
  version: "8.0",
  charset: "utf8_general_ci",
  ...knexSnakeCaseMappers()
};

module.exports = {
  development: {
    ...baseConfig,
    connection: devConnection
  },
  test: {
    ...baseConfig,
    connection: {
      host: "localhost",
      user: "root",
      password: "example",
      database: "medmcq_test"
    }
  }
};
