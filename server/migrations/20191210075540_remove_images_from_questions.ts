exports.up = function(knex) {
  return knex.schema.table('question', (t) => {
    t.dropColumn('image');
  });
};

exports.down = function(knex) {
  return knex.schema.table('question', (t) => {
    t.string('image');
  });
};
