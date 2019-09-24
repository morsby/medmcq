exports.up = function(knex) {
  return knex.schema.table('question_comment', (t) => {
    t.integer('anonymous', 1).default(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('question_comment', (t) => {
    t.dropColumn('anonymous');
  });
};
