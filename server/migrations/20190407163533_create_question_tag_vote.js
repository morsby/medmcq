exports.up = function(knex) {
  return knex.schema.createTable('question_tag_vote', table => {
    table.increments();

    table
      .integer('question_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('question')
      .onDelete('CASCADE');

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table
      .integer('tag_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('question_tag')
      .onDelete('CASCADE');

    table.integer('value').defaultTo(1);
    table.unique(['user_id', 'question_id', 'tag_id']);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_tag_vote');
};
