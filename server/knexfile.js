const { knexSnakeCaseMappers } = require('objection');
const { dbConnection } = require('./config/keys');

let baseConfig = {
  client: 'mysql',
  charset: 'utf8_unicode_ci',
  ...knexSnakeCaseMappers()
};
console.log(dbConnection);
module.exports = {
  development: {
    ...baseConfig,
    connection: dbConnection.dev
  },
  test: {
    ...baseConfig,
    connection: dbConnection.test
  },
  production: {
    ...baseConfig,
    connection: dbConnection
  },
  travis: {
    ...baseConfig,
    connection: dbConnection
  }
};
