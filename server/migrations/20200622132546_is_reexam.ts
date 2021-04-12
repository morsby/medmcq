import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('semester_exam_set', (t) => {
    t.integer('reexam', 1).defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('semester_exam_set', (t) => {
    t.dropColumn('reexam');
  });
}
