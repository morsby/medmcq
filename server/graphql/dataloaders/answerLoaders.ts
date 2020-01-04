import QuestionUserAnswer from 'models/question_user_answer';
import DataLoader from 'dataloader';

const batchUserAnswers = async (ids: number[]) => {
  const answers = await QuestionUserAnswer.query().findByIds(ids);
  return ids.map((id) => answers.find((answer) => answer.id === id));
};

const batchAnswersByQuestionId = async (ids: number[]) => {
  const answers = await QuestionUserAnswer.query().whereIn('questionId', ids);
  return ids.map((id) => answers.filter((answer) => answer.questionId === id));
};

export const userAnswersLoader = new DataLoader((ids: number[]) => batchUserAnswers(ids));
export const userAnswersByQuestionIdLoader = new DataLoader((ids: number[]) =>
  batchAnswersByQuestionId(ids)
);
