import Question from '../../models/question';
import QuestionComment from '../../models/question_comment';
import QuestionCorrectAnswer from '../../models/question_correct_answer';
import User from '../../models/user';

export const questionLoader = async (ids: [number]) => Question.query().findByIds(ids);

export const correctAnswersLoader = async (ids: [number]) => {
  const answers = await QuestionCorrectAnswer.query().whereIn('questionId', ids);
  return ids.map((id) => answers.filter((x) => x.questionId === id));
};

export const examSetLoader = async (questions: [Question]) => {
  const questionsWithExamSets = await Question.loadRelated(questions, 'examSet');
  return questionsWithExamSets.map((question) => question.examSet);
};

export const semesterLoader = async (questions: [Question]) => {
  const questionsWithSemesters = await Question.loadRelated(questions, 'semester');

  return questionsWithSemesters.map((q) => q.semester);
};

export const publicCommentsLoader = async (questions: [Question]) => {
  const questionsWithPublicComments = await Question.loadRelated(questions, 'publicComments');
  return questionsWithPublicComments.map((q) => q.publicComments);
};

export const privateCommentsLoader = async (user: User, ids: [number]) => {
  const comments = await QuestionComment.query()
    .whereIn('questionId', ids)
    .andWhere('userId', user.id)
    .andWhere('private', true);

  return ids.map((id) => comments.filter((x) => x.questionId === id));
};

export default {
  questionLoader,
  correctAnswersLoader,
  examSetLoader,
  semesterLoader,
  publicCommentsLoader,
  privateCommentsLoader
};
