import sampleQuestions from './data/20_sample_questions.js';
import * as Knex from 'knex';
import _ from 'lodash';

exports.seed = async (knex: Knex) => {
  await knex('question').del(); // Deletes ALL existing entries

  const examSets = await knex
    .from('semester_exam_set')
    .join('semester', { 'semester_exam_set.semester_id': 'semester.id' })
    .select('semester_exam_set.id', 'year', 'season', 'semester.value as semester');

  for (let q of sampleQuestions) {
    let examSetId = _.find(examSets, {
      semester: q.examSet.semester.value,
      year: q.examSet.year,
      season: q.examSet.season
    }).id;
    let qInsert: any = {
      text: q.text,
      answer1: q.answer1.answer,
      answer2: q.answer2.answer,
      answer3: q.answer3.answer,
      exam_set_qno: q.examSetQno,
      exam_set_id: examSetId
    };
    const [created] = await knex('question').insert(qInsert);
    for (let answer of q.correctAnswers) {
      await knex('question_correct_answer').insert({ question_id: created, answer });
    }
  }
};
