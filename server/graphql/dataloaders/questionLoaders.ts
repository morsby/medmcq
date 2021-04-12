import Dataloader from 'dataloader';
import Question from 'models/question';
import QuestionAnswer from 'models/questionAnswer.model';
import DataLoader from 'dataloader';

// Batchers
const batchQuestions = async (ids: number[]) => {
  const questions = await Question.query().findByIds(ids);
  return ids.map((id) => questions.find((q) => q.id === id));
};
const batchQuestionAnswers = async (ids: number[]) => {
  const answers = await QuestionAnswer.query().findByIds(ids);
  return ids.map((id) => answers.find((a) => a.id === id));
};
const batchQuestionAnswersByQuestion = async (ids: number[]) => {
  const answers = await QuestionAnswer.query().whereIn('questionId', ids);
  return ids.map((id) => answers.filter((a) => a.questionId === id));
};

// Loaders
export const createQuestionLoader = () => new Dataloader((ids: number[]) => batchQuestions(ids));
export const createQuestionAnswersLoader = () =>
  new Dataloader((ids: number[]) => batchQuestionAnswers(ids));
export const createQuestionAnswersByQuestionLoader = () =>
  new DataLoader((ids: number[]) => batchQuestionAnswersByQuestion(ids));
