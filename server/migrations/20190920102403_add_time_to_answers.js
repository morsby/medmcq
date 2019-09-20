exports.up = function(knex) {
  return knex.schema.table('question_user_answer', (t) => {
    t.integer('answer_time');
  });
};

exports.down = function(knex) {
  return knex.schema.table('question_user_answer', (t) => {
    t.dropColumn('answer_time');
  });
};
