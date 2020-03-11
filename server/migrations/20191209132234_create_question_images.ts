exports.up = function(knex) {
  return knex.schema.createTable('question_image', (t) => {
    t.increments('id');
    t.string('link').notNullable();
    t.integer('question_id')
      .unsigned()
      .notNullable()
      .references('question.id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_image');
};
