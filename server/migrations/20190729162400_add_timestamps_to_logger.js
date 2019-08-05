exports.up = function(knex) {
  return knex.schema.table('logger', (t) => {
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('logger', (t) => {
    knex.schema.hasColumn('logger', 'created_at').then((exists) => {
      if (exists) t.dropColumn('created_at');
    });
    knex.schema.hasColumn('logger', 'updated_at').then((exists) => {
      if (exists) t.dropColumn('updated_at');
    });
  });
};
