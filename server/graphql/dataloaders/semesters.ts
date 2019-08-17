import Semester from '../../models/semester';
import ExamSet from '../../models/exam_set';

export const semesterByIds = async (ids: number[]) => {
  const semesters = await Semester.query().whereIn('id', ids);
  return ids.map((id) => semesters.find((x) => x.id === id));
};

export const semestersByExamSetIds = async (examSetIds: number[]) => {
  const semesters = await ExamSet.query()
    .whereIn('semesterExamSet.id', examSetIds)
    .joinRelation('semester')
    .select('semester.*')
    .select('semesterExamSet.id as examSetId');

  return examSetIds.map((id) => semesters.find((x: ExamSet) => x['examSetId'] === id));
};
