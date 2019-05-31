exports.up = function(knex) {
  return knex.schema.createTable('question_specialty', (table) => {
    table.increments();
    table.string('name').notNullable();
    table
      .integer('semester_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('semester')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_specialty');
};
