const _ = require('lodash');

const sampleExamSets = require('./data/11_sample_exam_sets');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('semester_exam_set')
    .del()
    .then(async () => {
      // Get the current semesters, used to calculate semester ids
      const semesters = await knex.from('semester').select('id', 'shortName');

      // Inserts exam sets
      return knex('semester_exam_set').insert(
        sampleExamSets.map(s => {
          return {
            year: s.year,
            season: s.season,
            semester_id:
              semesters[_.findIndex(semesters, { shortName: s.semester_name })]
                .id
          };
        })
      );
    });
};
