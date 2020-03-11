exports.up = async function(knex) {
  const questions = await knex('question');
  for (let question of questions) {
    if (question.image) {
      await knex('question_image').insert({ link: question.image, questionId: question.id });
    }
  }

  return 'Success';
};

exports.down = function() {};
