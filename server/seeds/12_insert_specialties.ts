import _ from 'lodash';
import sampleSpecialer from './data/12_sample_specialer.json';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('question_specialty')
    .del()
    .then(async () => {
      // Get the current semesters, used to calculate semester ids
      const semesters = await knex.from('semester').select('id', 'short_name');

      // Inserts seed entries
      return knex('question_specialty').insert(
        sampleSpecialer.map((s) => {
          return {
            name: s.name,
            semester_id: _.find(semesters, { shortName: s.semester_name }).id,
          };
        })
      );
    });
};
