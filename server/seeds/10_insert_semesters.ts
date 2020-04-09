import sampleSemesters from './data/10_sample_semesters.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('semester')
    .del()
    .then(function() {
      // Inserts semesters
      return knex('semester').insert(sampleSemesters);
    });
};
