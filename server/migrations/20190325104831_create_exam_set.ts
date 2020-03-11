exports.up = function(knex) {
  return knex.schema.createTable('semester_exam_set', (table) => {
    table.increments();
    table.integer('year').notNullable();
    table.string('season').notNullable();

    table
      .integer('semester_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('semester')
      .onDelete('CASCADE');

    table.timestamps(true, true);

    /**
     * specialer, votes og kommentarer defineres via pivot table
     */
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('semester_exam_set');
};
