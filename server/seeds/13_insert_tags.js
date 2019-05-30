const _ = require('lodash');

const sampleTags = require('./data/13_sample_tags');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('question_tag')
    .del()
    .then(async () => {
      // Get the current semesters, used to calculate semester ids
      const semesters = await knex.from('semester').select('id', 'shortName');
      // Inserts seed entries

      return knex('question_tag').insert(
        sampleTags.map(t => {
          return {
            name: t.name,
            semester_id: _.find(semesters, { shortName: t.semester_name }).id
          };
        })
      );
    });
};
