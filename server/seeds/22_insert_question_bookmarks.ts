import _ from 'lodash';
import sampleBookmarks from './data/22_sample_bookmarks.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('question_bookmark')
    .del()
    .then(async () => {
      const users = await knex.from('user').select('id', 'username');
      const questions = await knex.from('question').select('id');
      let bookmarks = sampleBookmarks.map((bookmark: any, i) => {
        bookmark.user_id = _.find(users, { username: bookmark.user_id }).id;
        bookmark.question_id = questions[i].id;
        return bookmark;
      });
      return knex('question_bookmark').insert(bookmarks);
    });
};
