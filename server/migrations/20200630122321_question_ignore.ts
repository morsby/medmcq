import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('question_ignores', (t) => {
    t.integer('user_id').unsigned().references('user.id').onDelete('cascade').onUpdate('cascade');
    t.integer('question_id')
      .unsigned()
      .references('question.id')
      .onDelete('cascade')
      .onUpdate('cascade');
    t.primary(['user_id', 'question_id']);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('question_ignores');
}
