exports.up = function(knex) {
  return knex.schema.createTable('question', (table) => {
    table.increments();
    table.text('text').notNullable();
    table.text('answer1').notNullable();
    table.text('answer2').notNullable();
    table.text('answer3').notNullable();
    table.string('image');
    table.string('old_id');
    // TODO: Slet old_id senere
    table.integer('exam_set_qno').notNullable();
    table
      .integer('exam_set_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('semester_exam_set')
      .onDelete('CASCADE');

    table.timestamps(true, true);

    /**
     * specialer, votes og kommentarer defineres via pivot table
     */
    table.index(['text', 'answer1', 'answer2', 'answer3'], 'ft', 'FULLTEXT');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question');
};
