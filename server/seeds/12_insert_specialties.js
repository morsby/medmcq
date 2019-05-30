const _ = require('lodash');

const sampleSpecialer = require('./data/12_sample_specialer');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('question_specialty')
    .del()
    .then(async () => {
      // Get the current semesters, used to calculate semester ids
      const semesters = await knex.from('semester').select('id', 'shortName');

      // Inserts seed entries
      return knex('question_specialty').insert(
        sampleSpecialer.map(s => {
          return {
            name: s.name,
            semester_id: _.find(semesters, { shortName: s.semester_name }).id
          };
        })
      );
    });
};
