import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('user_role', (t) => {
    t.dropColumn('level');
    t.dropColumn('created_at');
    t.dropColumn('updated_at');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('user_role', (t) => {
    t.integer('level');
    t.timestamps(true, true);
  });
}
