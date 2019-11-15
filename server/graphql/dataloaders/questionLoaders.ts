import dataloader from 'dataloader';
import Question from 'models/question';
import QuestionCorrectAnswer from 'models/question_correct_answer';

// Batchers
const batchQuestions = async (ids: number[]) => {
  const questions = await Question.query().findByIds(ids);
  return ids.map((id) => questions.find((q) => q.id === id));
};
const batchCorrectAnswersByQuestionId = async (ids: number[]) => {
  const correctAnswers = await QuestionCorrectAnswer.query().whereIn('questionId', ids);
  return ids.map((id) => correctAnswers.filter((ca) => ca.questionId === id));
};

// Loaders
export const questionLoader = new dataloader((ids: number[]) => batchQuestions(ids));
export const correctAnswersByQuestionIdLoader = new dataloader((ids: number[]) =>
  batchCorrectAnswersByQuestionId(ids)
);
