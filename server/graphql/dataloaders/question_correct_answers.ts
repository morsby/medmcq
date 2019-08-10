import QuestionCorrectAnswer from '../../models/question_correct_answer';

/**
 * Resolver to find correct answers for questions by answer id. Returns a single answer.
 * @param ids An array of correct answer ids
 */
export const correctAnswersByIds = async (ids: number[]) => {
  const answers = await QuestionCorrectAnswer.query().whereIn('id', ids);
  return ids.map((id) => answers.find((x) => x.id === id));
};

/**
 * Resolver to find correct answers for a question by question id. Returns an array of answers.
 * @param ids An array of question ids
 */
export const correctAnswersByQuestionIds = async (questionIds: number[]) => {
  const answers = await QuestionCorrectAnswer.query().whereIn('questionId', questionIds);
  return questionIds.map((id) => answers.filter((x) => x.questionId === id));
};
