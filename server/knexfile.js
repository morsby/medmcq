// Update with your config settings.
const { knexSnakeCaseMappers } = require("objection");

let baseConfig = {
  client: "mysql",
  version: "8.0",
  charset: "utf8_general_ci",
  ...knexSnakeCaseMappers()
};

module.exports = {
  development: {
    ...baseConfig,
    connection: {
      host: "localhost",
      user: "root",
      password: "example",
      database: "medmcq"
    }
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
