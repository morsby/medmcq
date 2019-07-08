exports.up = function(knex, Promise) {
  return knex.schema.table("question_tag", function(t) {
    t.string("old_id");
    t.integer("parent_id")
      .unsigned()
      .references("id")
      .inTable("question_tag")
      .onDelete("SET NULL");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("question_tag", function(t) {
    t.dropColumn("old_id");
    t.dropForeign("parent_id");
    t.dropColumn("parent_id");
  });
};
