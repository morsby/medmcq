exports.up = function(knex) {
  return knex.schema.createTable('logger', (t) => {
    t.increments();
    t.string('method');
    t.string('url');
    t.string('query');
    t.string('body');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('logger');
};
