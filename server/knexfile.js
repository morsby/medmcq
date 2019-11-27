const { knexSnakeCaseMappers } = require('objection');

let baseConfig = {
  client: 'mysql',
  version: '8.0',
  charset: 'utf8_unicode_ci',
  ...knexSnakeCaseMappers()
};

module.exports = {
  ...baseConfig,
  connection: process.env.DB_URL
};
