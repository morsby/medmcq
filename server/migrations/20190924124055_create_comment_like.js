exports.up = function(knex) {
  return knex.schema.createTable('question_comment_like', (t) => {
    t.integer('comment_id')
      .unsigned()
      .notNullable()
      .references('question_comment.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.primary(['user_id', 'comment_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('question_comment_like');
};
