require('dotenv-flow').config({ node_env: process.env.NODE_ENV || 'development', path: '../' });
import { knexSnakeCaseMappers } from 'objection';

module.exports = {
  client: 'mysql',
  connection: process.env.DB_URL,
  ...knexSnakeCaseMappers(),
};
