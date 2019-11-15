import QuestionSpecialtyVote from 'models/question_specialty_vote';
import dataloader from 'dataloader';
import Specialty from 'models/specialty';

// Batchers ============================================================================
const batchSpecialtyVotesByQuestionId = async (ids: number[]) => {
  const specialtyVotes = await QuestionSpecialtyVote.query().whereIn('questionId', ids);
  return ids.map((id) => specialtyVotes.filter((s) => s.questionId === id));
};

const batchSpecialties = async (ids: number[]) => {
  const specialties = await Specialty.query().findByIds(ids);
  return ids.map((id) => specialties.find((s) => s.id === id));
};

const batchSpecialtyVotes = async (ids: number[]) => {
  const specialtyVotes = await QuestionSpecialtyVote.query().findByIds(ids);
  return ids.map((id) => specialtyVotes.find((s) => s.id === id));
};

// Loaders ============================================================================
export const specialtyVotesByQuestionIdLoader = new dataloader((ids: number[]) =>
  batchSpecialtyVotesByQuestionId(ids)
);
export const specialtyLoader = new dataloader((ids: number[]) => batchSpecialties(ids));
export const specialtyVoteLoader = new dataloader((ids: number[]) => batchSpecialtyVotes(ids));
