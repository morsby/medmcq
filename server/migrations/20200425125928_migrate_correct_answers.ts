import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  const questionCorrectAnswers = await knex('question_correct_answer');

  for (let correctAnswer of questionCorrectAnswers) {
    await knex('question_answers')
      .where({ questionId: correctAnswer.questionId, index: correctAnswer.answer })
      .update({ isCorrect: 1 });
  }
}

export async function down(knex: Knex): Promise<any> {}
