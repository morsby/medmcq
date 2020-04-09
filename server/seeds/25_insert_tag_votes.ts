import _ from 'lodash';
import sampleVotes from './data/25_sample_tag_votes.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('question_tag_vote')
    .del()
    .then(async () => {
      const users = await knex.from('user').select('id', 'username');
      const questions = await knex.from('question').select('id');
      const tags = await knex.from('question_tag').select('id', 'name');
      let votes = sampleVotes.map((vote: any, i) => {
        vote.user_id = _.find(users, { username: vote.user_id }).id;
        vote.question_id = questions[i].id;
        vote.tag_id = _.find(tags, {
          name: vote.tag_id
        }).id;
        return vote;
      });
      return knex('question_tag_vote').insert(votes);
    });
};
