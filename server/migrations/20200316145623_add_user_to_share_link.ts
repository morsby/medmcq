import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('share_links', (t) => {
    t.integer('user_id')
      .unsigned()
      .references('user.id')
      .onDelete('restrict')
      .onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('share_links', (t) => {
    t.dropColumn('user_id');
  });
}
