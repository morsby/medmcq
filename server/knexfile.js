const { knexSnakeCaseMappers } = require('objection');

let baseConfig = {
  client: 'mysql',
  version: '8.0',
  charset: 'utf8_unicode_ci',
  ...knexSnakeCaseMappers()
};
module.exports = {
  development: {
    ...baseConfig,
    connection: process.env.DB_URL
  },
  test: {
    ...baseConfig,
    connection: process.env.DB_URL
  },
  production: {
    ...baseConfig,
    connection: process.env.DB_URL
  },
  travis: {
    ...baseConfig,
    connection: process.env.DB_URL
  }
};
