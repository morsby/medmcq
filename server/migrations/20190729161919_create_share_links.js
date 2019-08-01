exports.up = function(knex) {
  return knex.schema.createTable('share_links', (t) => {
    t.increments();
    t.bigint('share_id', 10)
      .unsigned()
      .notNullable();
    t.integer('question_id')
      .unsigned()
      .notNullable()
      .references('question.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('share_links');
};
