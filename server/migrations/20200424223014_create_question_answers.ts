import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('question_answers', (t) => {
    t.increments();
    t.text('text');
    t.integer('index', 1);
    t.integer('question_id')
      .unsigned()
      .references('question.id')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('question_answers');
}
