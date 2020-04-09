import _ from 'lodash';
import sampleComments from './data/21_sample_comments.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('question_comment')
    .del()
    .then(async () => {
      const users = await knex.from('user').select('id', 'username');
      const questions = await knex.from('question').select('id');
      let comments = sampleComments.map((comment: any, i) => {
        comment.user_id = _.find(users, { username: comment.user_id }).id;
        comment.question_id = questions[i].id;
        return comment;
      });
      return knex('question_comment').insert(comments);
    });
};
