import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('notice', (t) => {
    t.increments();
    t.text('message');
    t.string('color');
  });

  await knex('notice').insert({ message: null });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('notice');
}
