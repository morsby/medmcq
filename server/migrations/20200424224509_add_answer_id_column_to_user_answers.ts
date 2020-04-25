import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  console.log('adding answerId column...');
  await knex.schema.alterTable('question_user_answer', (t) => {
    t.integer('answer_id')
      .unsigned()
      .references('question_answers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
  console.log('AnswerId column has been added!');
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question_user_answer', (t) => {
    t.dropColumn('answer_id');
  });
}
