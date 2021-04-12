import _ from 'lodash';
import sampleVotes from './data/24_sample_specialty_votes.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('question_specialty_vote')
    .del()
    .then(async () => {
      const users = await knex.from('user').select('id', 'username');
      const questions = await knex.from('question').select('id');
      const specialties = await knex.from('question_specialty').select('id', 'name');
      let votes = sampleVotes.map((vote: any, i) => {
        vote.user_id = _.find(users, { username: vote.user_id }).id;
        vote.question_id = questions[i].id;
        vote.specialty_id = _.find(specialties, {
          name: vote.specialty_id
        }).id;
        return vote;
      });
      return knex('question_specialty_vote').insert(votes);
    });
};
