import ExamSet from 'models/exam_set';
import dataloader from 'dataloader';

// Batchers
const batchExamSets = async (ids: number[]) => {
  const examSets = await ExamSet.query().findByIds(ids);
  return ids.map((id) => examSets.find((es) => es.id === id));
};

// Loaders
export const examSetsLoader = new dataloader((ids: number[]) => batchExamSets(ids));
