exports.up = function(knex) {
  return knex.schema.table('logger', (t) => {
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('logger', (t) => {
    t.dropColumn('created_at');
    t.dropColumn('updated_at');
  });
};
