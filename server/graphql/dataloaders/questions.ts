import Question from '../../models/question';
import ExamSet from '../../models/exam_set';
import QuestionComment from '../../models/question_comment';
import QuestionSpecialtyVote from 'models/question_specialty_vote';

export const questionsByIds = async (ids: number[]) => Question.query().findByIds(ids);

export const questionsByExamSetIds = async (ids: number[]) => {
  const questions = await Question.query().whereIn('examSetId', ids);
  return ids.map((id) => questions.filter((q) => q.examSetId === id));
};

export const questionsBySemesterIds = async (ids: number[]) => {
  const questions = await Question.query()
    .whereIn(
      'examSetId',
      ExamSet.query()
        .whereIn('semesterId', ids)
        .select('id as examSetId')
    )
    .joinRelation('semester')
    .select('question.*')
    .select('semester.id as semesterId');

  return ids.map((id) => questions.filter((q: Question) => q['semesterId'] === id));
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
