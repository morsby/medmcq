import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';

export const knex = Knex({
  client: 'mysql',
  connection: process.env.DB_URL,
  ...knexSnakeCaseMappers()
});

export default Model.knex(knex);
