const _ = require("lodash");
const sampleVotes = require("./data/25_sample_tag_votes");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("question_tag_vote")
    .del()
    .then(async () => {
      const users = await knex.from("user").select("id", "username");
      const questions = await knex.from("question").select("id", "old_id");
      const tags = await knex.from("question_tag").select("id", "name");
      let votes = sampleVotes.map(vote => {
        vote.user_id = _.find(users, { username: vote.user_id }).id;
        vote.question_id = _.find(questions, {
          oldId: vote.question_id
        }).id;
        vote.tag_id = _.find(tags, {
          name: vote.tag_id
        }).id;
        return vote;
      });
      return knex("question_tag_vote").insert(votes);
    });
};
