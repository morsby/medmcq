import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('share_links', (t) => {
    t.string('share_id').alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('share_links', (t) => {
    t.integer('share_id').alter();
  });
}
