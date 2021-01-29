import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('semester', (t) => {
    t.integer('value').nullable().alter();
  });
  await knex.schema.alterTable('semester_exam_set', (t) => {
    t.string('name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('semester', (t) => {
    t.integer('value').notNullable().alter();
  });
  await knex.schema.alterTable('semester_exam_set', (t) => {
    t.dropColumn('name');
  });
}
