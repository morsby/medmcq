import ExamSet from 'models/exam_set';
import Dataloader from 'dataloader';

// Batchers
const batchExamSets = async (ids: number[]) => {
  const examSets = await ExamSet.query().findByIds(ids);
  return ids.map((id) => examSets.find((es) => es.id === id));
};

// Loaders
export const createExamSetsLoader = () => new Dataloader((ids: number[]) => batchExamSets(ids));
