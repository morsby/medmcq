const { knexSnakeCaseMappers } = require('objection');
const { dbConnection } = require('./config/keys');

let baseConfig = {
  client: 'mysql',
  charset: 'utf8_unicode_ci',
  ...knexSnakeCaseMappers()
};
module.exports = {
  development: {
    ...baseConfig,
    connection: dbConnection.dev
  },
  test: {
    ...baseConfig,
    connection: dbConnection.test
  },
  prod: {
    ...baseConfig,
    connection: dbConnection
  }
};
