const _ = require('lodash');
const sampleBookmarks = require('./data/22_sample_bookmarks');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('question_bookmark')
    .del()
    .then(async () => {
      const users = await knex.from('user').select('id', 'username');
      const questions = await knex.from('question').select('id', 'old_id');
      let bookmarks = sampleBookmarks.map((bookmark) => {
        bookmark.user_id = _.find(users, { username: bookmark.user_id }).id;
        bookmark.question_id = _.find(questions, {
          oldId: bookmark.question_id
        }).id;
        return bookmark;
      });
      return knex('question_bookmark').insert(bookmarks);
    });
};
