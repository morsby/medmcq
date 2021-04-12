import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('questionAnswers', (t) => {
    t.index('text', 'text_fulltext_index', 'FULLTEXT');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('questionAnswers', (t) => {
    t.dropIndex('text', 'text');
  });
}
