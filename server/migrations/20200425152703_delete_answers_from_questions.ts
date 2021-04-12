import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question', (t) => {
    t.dropColumn('answer1');
    t.dropColumn('answer2');
    t.dropColumn('answer3');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question', (t) => {
    t.text('answer1');
    t.text('answer2');
    t.text('answer3');
  });
}
