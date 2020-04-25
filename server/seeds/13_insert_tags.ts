import _ from 'lodash';
import sampleTags from './data/13_sample_tags.json';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('question_tag')
    .del()
    .then(async () => {
      // Get the current semesters, used to calculate semester ids
      const semesters = await knex.from('semester').select('id', 'short_name');
      // Inserts seed entries

      return knex('question_tag').insert(
        sampleTags.map((t) => {
          return {
            name: t.name,
            semester_id: _.find(semesters, { shortName: t.semester_name }).id,
          };
        })
      );
    });
};
