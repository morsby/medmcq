import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  const questionCorrectAnswers = await knex('question_correct_answer');

  let index = 0;
  for (let correctAnswer of questionCorrectAnswers) {
    console.log(`Migrating correct answer ${index} of ${questionCorrectAnswers.length}`);
    await knex('question_answers')
      .where({ questionId: correctAnswer.questionId, index: correctAnswer.answer })
      .update({ isCorrect: 1 });
    index++;
  }

  console.log('correct answers have been successfully migrated');
}

export async function down(knex: Knex): Promise<any> {}
