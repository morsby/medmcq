import QuestionUserAnswer from 'models/question_user_answer';
import dataLoader from 'dataloader';

const batchUserAnswers = async (ids: number[]) => {
  const answers = await QuestionUserAnswer.query().findByIds(ids);
  return ids.map((id) => answers.find((answer) => answer.id === id));
};

export const userAnswersLoader = new dataLoader((ids: number[]) => batchUserAnswers(ids));
