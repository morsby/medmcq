import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question', (t) => {
    t.integer('user_id')
      .unsigned()
      .references('user.id')
      .onDelete('restrict')
      .onUpdate('restrict');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question', (t) => {
    t.dropColumn('user_id');
  });
}
