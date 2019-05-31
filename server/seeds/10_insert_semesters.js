const sampleSemesters = require('./data/10_sample_semesters');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('semester')
    .del()
    .then(function() {
      // Inserts semesters
      return knex('semester').insert(sampleSemesters);
    });
};
