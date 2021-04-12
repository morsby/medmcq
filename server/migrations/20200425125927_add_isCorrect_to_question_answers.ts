import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question_answers', (t) => {
    t.integer('is_correct', 1).defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question_answers', (t) => {
    t.dropColumn('is_correct');
  });
}
