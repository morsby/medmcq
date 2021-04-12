import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  const questionAnswers = await knex('question_answers');

  for (let questionAnswer of questionAnswers) {
    const userAnswers = await knex('question_user_answer').where({
      questionId: questionAnswer.questionId,
      answer: questionAnswer.index
    });

    for (let answer of userAnswers) {
      await knex('question_user_answer')
        .where({ id: answer.id })
        .update({ answerId: questionAnswer.id });
    }
  }
}

export async function down(knex: Knex): Promise<any> {}
