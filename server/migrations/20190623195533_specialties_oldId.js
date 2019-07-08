exports.up = function(knex) {
  return knex.schema.table('question_specialty', function(t) {
    t.string('old_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('question_specialty', function(t) {
    t.dropColumn('old_id');
  });
};
