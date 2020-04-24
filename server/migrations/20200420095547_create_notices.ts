import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('notice', (t) => {
    t.increments();
    t.text('message');
    t.string('color');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('notice');
}
