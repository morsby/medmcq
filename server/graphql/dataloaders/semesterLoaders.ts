import Semester from 'models/semester';
import DataLoader from 'dataloader';

// Batchers
const batchSemesters = async (ids: number[]) => {
  const semesters = await Semester.query().findByIds(ids);
  return ids.map((id) => semesters.find((semester) => semester.id === id));
};

// Loaders
export const createSemesterLoader = () => new DataLoader((ids: number[]) => batchSemesters(ids));
