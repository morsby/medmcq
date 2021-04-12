import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('notifications', (t) => {
    t.increments();
    t.text('message');
    t.integer('user_id').unsigned().references('user.id').onDelete('cascade').onUpdate('cascade');
    t.integer('is_read', 1).defaultTo(0);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('notifications');
}
