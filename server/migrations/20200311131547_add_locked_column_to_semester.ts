import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable('semester', (t) => {
    t.integer('locked', 1).defaultTo(0);
  });

  await knex('semester').insert({ value: 10, name: 'Øre-næse-hals', short_name: 'ØNH', locked: 1 });
  return 0;
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('semester', (t) => {
    t.dropColumn('locked');
  });
}
