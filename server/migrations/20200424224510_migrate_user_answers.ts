import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  console.log('Starting large migration...');
  const questionAnswers = await knex('question_answers');

  console.log('Starting parsing. This is going to take some time...');
  let index = 0;
  for (let questionAnswer of questionAnswers) {
    console.log(`Parsing answer ${index} out of ${questionAnswers.length}`);

    const userAnswers = await knex('question_user_answer').where({
      questionId: questionAnswer.questionId,
      answer: questionAnswer.index,
    });

    for (let answer of userAnswers) {
      await knex('question_user_answer')
        .where({ id: answer.id })
        .update({ answerId: questionAnswer.id });
    }

    index++;
  }

  console.log('Finished large migration!');
}

export async function down(knex: Knex): Promise<any> {}
