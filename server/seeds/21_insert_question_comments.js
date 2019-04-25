const _ = require("lodash");
const sampleComments = require("./data/21_sample_comments");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("question_comment")
    .del()
    .then(async () => {
      const users = await knex.from("user").select("id", "username");
      const questions = await knex.from("question").select("id", "old_id");
      let comments = sampleComments.map(comment => {
        comment.user_id = _.find(users, { username: comment.user_id }).id;
        comment.question_id = _.find(questions, {
          oldId: comment.question_id
        }).id;
        return comment;
      });
      return knex("question_comment").insert(comments);
    });
};
