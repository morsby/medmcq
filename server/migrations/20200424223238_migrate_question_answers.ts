import * as Knex from 'knex';
import { flatMap } from 'lodash';

export async function up(knex: Knex): Promise<any> {
  const questions = await knex('question');
  const answers = flatMap(questions, (q) => [
    {
      text: q.answer1,
      index: 1,
      question_id: q.id,
    },
    {
      text: q.answer2,
      index: 2,
      question_id: q.id,
    },
    {
      text: q.answer3,
      index: 3,
      question_id: q.id,
    },
  ]);
  for (let answer of answers) {
    await knex('question_answers').insert(answer);
  }
}

export async function down(knex: Knex): Promise<any> {
  return knex('question_answers').del();
}
