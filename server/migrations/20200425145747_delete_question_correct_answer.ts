import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('question_correct_answer');
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.createTable('question_correct_answer', (table) => {
    table.increments();
    table.integer('answer').notNullable();
    table
      .integer('question_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('question')
      .onDelete('CASCADE');

    table.unique(['answer', 'question_id']);

    table.timestamps(true, true);

    /**
     * specialer, votes og kommentarer defineres via pivot table
     */
  });
}
