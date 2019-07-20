exports.up = function(knex) {
  return knex.schema.createTable('manual_completed_sets', (t) => {
    t.increments();
    t.integer('user_id')
      .unsigned()
      .notNullable()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.integer('set_id')
      .unsigned()
      .notNullable()
      .references('semester_exam_set.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('completed_sets');
};
