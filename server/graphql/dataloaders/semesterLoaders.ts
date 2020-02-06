import Semester from 'models/semester';
import dataLoader from 'dataloader';

// Batchers
const batchSemesters = async (ids: number[]) => {
  const semesters = await Semester.query().findByIds(ids);
  return ids.map((id) => semesters.find((semester) => semester.id === id));
};

// Loaders
export const semesterLoader = new dataLoader((ids: number[]) => batchSemesters(ids));
