import ExamSet from '../../models/exam_set';
import Question from '../../models/question';

export const examSetByIds = async (ids: number[]) => {
  const examSets = await ExamSet.query().whereIn('id', ids);
  return ids.map((id) => examSets.find((x) => x.id === id));
};

export const examSetByQuestions = async (questions: Question[]) => {
  const questionsWithExamSets = await Question.loadRelated(questions, 'examSet');

  return questionsWithExamSets.map((q) => q.examSet);
};

export const examSetBySemesterIds = async (ids: number[]) => {
  const examSets = await ExamSet.query().whereIn('semesterId', ids);
  return ids.map((id) => examSets.filter((x) => x.semesterId === id));
};
