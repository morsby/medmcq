import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('semester_exam_set', t => {
        t.integer('had_help', 1).defaultTo(0)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('semester_exam_set', t => {
        t.dropColumn('had_help')
    })
}

