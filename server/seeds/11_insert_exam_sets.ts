import _ from 'lodash';
import sampleExamSets from './data/11_sample_exam_sets.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('semester_exam_set')
    .del()
    .then(async () => {
      // Get the current semesters, used to calculate semester ids
      const semesters = await knex.from('semester').select('id', 'short_name');

      // Inserts exam sets
      return knex('semester_exam_set').insert(
        sampleExamSets.map((s) => {
          return {
            year: s.year,
            season: s.season,
            semester_id: semesters[_.findIndex(semesters, { short_name: s.semester_name })].id
          };
        })
      );
    });
};
