const { knexSnakeCaseMappers } = require('objection');
const dotEnv = require('dotenv-flow');
dotEnv.config({ default_node_env: 'development' });

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
