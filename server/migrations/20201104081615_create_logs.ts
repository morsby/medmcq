import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('logs', t => {
        t.increments();
        t.text('name');
        t.integer('user_id').unsigned().references('user.id').onDelete('set null').onUpdate('cascade')
        t.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('logs')
}

