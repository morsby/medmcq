import Question from '../../models/question';
import QuestionComment from '../../models/question_comment';
import User from '../../models/user';
import QuestionSpecialtyVote from 'models/question_specialty_vote';

export const questionsByIds = async (ids: number[]) => Question.query().findByIds(ids);

export const examSetByQuestions = async (questions: Question[]) => {
  const questionsWithExamSets = await Question.loadRelated(questions, 'examSet');
  return questionsWithExamSets.map((question) => question.examSet);
};

export const publicCommentsByQuestions = async (questions: Question[]) => {
  const questionsWithPublicComments = await Question.loadRelated(questions, 'publicComments');
  return questionsWithPublicComments.map((q) => q.publicComments);
};

export const privateCommentsByQuestionIds = async (userId: number, ids: number[]) => {
  const comments = await QuestionComment.query()
    .whereIn('questionId', ids)
    .andWhere('userId', userId)
    .andWhere('private', true);

  return ids.map((id) => comments.filter((x) => x.questionId === id));
};

export const specialtiesByQuestionIds = async (userId: number, ids: number[]) => {
  /* const specialties = await QuestionSpecialtyVote.query()
    .whereIn('questionId', ids)
    .groupBy('specialtyId')
    .sum('vote as votes')
    .having();

  return specialties; */
  return [];
};
