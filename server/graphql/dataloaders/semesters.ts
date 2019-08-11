import Semester from '../../models/semester';
import Question from '../../models/question';

export const semesterByIds = async (ids: number[]) => {
  const semesters = await Semester.query().whereIn('id', ids);
  return ids.map((id) => semesters.find((x) => x.id === id));
};

export const semesterByQuestions = async (questions: Question[]) => {
  const questionsWithSemesters = await Question.loadRelated(questions, 'semester');

  return questionsWithSemesters.map((q) => q.semester);
};
