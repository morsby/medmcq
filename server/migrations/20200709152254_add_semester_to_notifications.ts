import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable('notifications', (t) => {
    t.integer('semester_id')
      .unsigned()
      .references('semester.id')
      .onUpdate('cascade')
      .onDelete('set null');
  });

  const notifications = await knex('notifications');
  let i = 0;
  for (let n of notifications) {
    console.log('Parsing notification ' + i + ' off ' + notifications.length);
    const capture = n.message.split(/https:\/\/medmcq.au.dk\/quiz\/(\d+)/);
    const questionId = Number(capture[1]);
    if (Number.isNaN(questionId)) {
      continue;
    }
    const question = await knex('question')
      .join('semester_exam_set', 'exam_set_id', 'semester_exam_set.id')
      .where('question.id', questionId)
      .select('semester_id')
      .first();
    const dbSemester = await knex('semester').where({ id: question.semesterId }).first();
    await knex('notifications').where({ id: n.id }).update({ semester_id: dbSemester.id });
    i++;
  }
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('notifications', (t) => {
    t.dropColumn('semester_id');
  });
}
