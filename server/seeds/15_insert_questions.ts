import sampleQuestions from './data/20_sample_questions.js';
import * as Knex from 'knex';
import _ from 'lodash';

exports.seed = async (knex: Knex) => {
  await knex('question').del(); // Deletes ALL existing entries
  await knex('question_answers').del();

  const examSets = await knex
    .from('semester_exam_set')
    .join('semester', { 'semester_exam_set.semester_id': 'semester.id' })
    .select('semester_exam_set.id', 'year', 'season', 'semester.value as semester');

  for (let q of sampleQuestions) {
    console.log(examSets);
    console.log(q);
    let examSetId = _.find(examSets, {
      semester: q.examSet.semester.value,
      year: q.examSet.year,
      season: q.examSet.season
    }).id;
    let qInsert: any = {
      text: q.text,
      exam_set_qno: q.examSetQno,
      exam_set_id: examSetId
    };
    const [created] = await knex('question').insert(qInsert);
    await knex('question_answers').insert({
      questionId: created,
      isCorrect: q.correctAnswers.includes(1),
      text: q.answer1.answer,
      index: 1
    });
    await knex('question_answers').insert({
      questionId: created,
      isCorrect: q.correctAnswers.includes(2),
      text: q.answer2.answer,
      index: 2
    });
    await knex('question_answers').insert({
      questionId: created,
      isCorrect: q.correctAnswers.includes(3),
      text: q.answer3.answer,
      index: 3
    });
  }
};
