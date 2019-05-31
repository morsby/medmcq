const sampleQuestions = require('./data/20_sample_questions.js');
const _ = require('lodash');

exports.seed = knex => {
  // Deletes ALL existing entries
  return knex('question')
    .del()
    .then(async () => {
      const examSets = await knex
        .from('semester_exam_set')
        .join('semester', { 'semester_exam_set.semester_id': 'semester.id' })
        .select(
          'semester_exam_set.id',
          'year',
          'season',
          'semester.value as semester'
        );

      // Insert questions
      let qs = sampleQuestions.map(q => {
        let set = q.set.split('/');

        let examSetId = _.find(examSets, {
          semester: q.semester,
          year: Number(set[0]),
          season: set[1]
        }).id;

        q = { ...q, exam_set_id: examSetId };
        delete q.correctAnswers;
        delete q.semester;
        delete q.set;
        return q;
      });
      return knex('question').insert(qs);
    })
    .then(async () => {
      // insert correct answers
      let correctAnswers = [];
      const qs = await knex.from('question').select('id', 'old_id');

      sampleQuestions.forEach(q =>
        q.correctAnswers.map(ans => {
          correctAnswers.push({
            questionId: _.find(qs, { oldId: q.old_id }).id,
            answer: ans
          });
        })
      );

      return knex('question_correct_answer').insert(correctAnswers);
    });
};
