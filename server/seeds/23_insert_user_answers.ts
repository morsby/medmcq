import _ from 'lodash';
import sampleAnswers from './data/23_sample_answers.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('question_user_answer')
    .del()
    .then(async () => {
      const users = await knex.from('user').select('id', 'username');
      const questions = await knex.from('question').select('id');
      let answers = sampleAnswers.map((answer: any, i) => {
        answer.user_id = _.find(users, { username: answer.user_id }).id;
        answer.question_id = questions[i].id;
        return answer;
      });
      return knex('question_user_answer').insert(answers);
    });
};
