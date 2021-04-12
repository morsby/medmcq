import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('maintenance', (t) => {
    t.increments();
    t.text('message');
  });

  await knex('maintenance').insert({ message: null });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('maintenance');
}
