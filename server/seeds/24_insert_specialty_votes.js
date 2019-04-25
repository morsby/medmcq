const _ = require("lodash");
const sampleVotes = require("./data/24_sample_specialty_votes");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("question_specialty_vote")
    .del()
    .then(async () => {
      const users = await knex.from("user").select("id", "username");
      const questions = await knex.from("question").select("id", "old_id");
      const specialties = await knex
        .from("question_specialty")
        .select("id", "name");
      let votes = sampleVotes.map(vote => {
        vote.user_id = _.find(users, { username: vote.user_id }).id;
        vote.question_id = _.find(questions, {
          oldId: vote.question_id
        }).id;
        vote.specialty_id = _.find(specialties, {
          name: vote.specialty_id
        }).id;
        return vote;
      });
      return knex("question_specialty_vote").insert(votes);
    });
};
