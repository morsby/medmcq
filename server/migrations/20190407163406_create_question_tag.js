exports.up = function(knex, Promise) {
  return knex.schema.createTable("question_tag", table => {
    table.increments();
    table.string("name").notNullable();
    table
      .integer("semester_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("semester")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("question_tag");
};
