import Question from '../../models/question';
import QuestionComment from '../../models/question_comment';
import QuestionCorrectAnswer from '../../models/question_correct_answer';
import User from '../../models/user';
import QuestionSpecialtyVote from 'models/question_specialty_vote';

export const questionsByIds = async (ids: number[]) => Question.query().findByIds(ids);

export const correctAnswersByQuestionIds = async (ids: number[]) => {
  const answers = await QuestionCorrectAnswer.query().whereIn('questionId', ids);
  return ids.map((id) => answers.filter((x) => x.questionId === id));
};

export const examSetByQuestions = async (questions: Question[]) => {
  const questionsWithExamSets = await Question.loadRelated(questions, 'examSet');
  return questionsWithExamSets.map((question) => question.examSet);
};

export const semesterByQuestions = async (questions: Question[]) => {
  const questionsWithSemesters = await Question.loadRelated(questions, 'semester');

  return questionsWithSemesters.map((q) => q.semester);
};

export const publicCommentsByQuestions = async (questions: Question[]) => {
  const questionsWithPublicComments = await Question.loadRelated(questions, 'publicComments');
  return questionsWithPublicComments.map((q) => q.publicComments);
};

export const privateCommentsByQuestionIds = async (user: User, ids: number[]) => {
  const comments = await QuestionComment.query()
    .whereIn('questionId', ids)
    .andWhere('userId', user.id)
    .andWhere('private', true);

  return ids.map((id) => comments.filter((x) => x.questionId === id));
};

export const specialtiesByQuestionIds = async (user: User, ids: number[]) => {
  const specialties = await QuestionSpecialtyVote.query()
    .whereIn('questionId', ids)
    .groupBy('specialtyId')
    .sum('vote as votes')
    .having();

  return specialties;
};
