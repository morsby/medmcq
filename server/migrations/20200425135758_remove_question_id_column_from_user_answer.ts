import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  console.log('dropping columns from user_answers. This will take some time.');
  await knex.schema.alterTable('question_user_answer', (t) => {
    t.dropForeign(['question_id', 'question.id'], 'question_user_answer_question_id_foreign');
    t.dropColumn('question_id');
    t.dropColumn('answer');
  });
  console.log('columns have been dropped');
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('question_user_answer', (t) => {
    t.integer('question_id');
    t.integer('answer');
  });
}
