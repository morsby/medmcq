const _ = require("lodash");
const sampleAnswers = require("./data/23_sample_answers");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("question_user_answer")
    .del()
    .then(async () => {
      const users = await knex.from("user").select("id", "username");
      const questions = await knex.from("question").select("id", "old_id");
      let answers = sampleAnswers.map(answer => {
        answer.user_id = _.find(users, { username: answer.user_id }).id;
        answer.question_id = _.find(questions, {
          oldId: answer.question_id
        }).id;
        return answer;
      });
      return knex("question_user_answer").insert(answers);
    });
};
