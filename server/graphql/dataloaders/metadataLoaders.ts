import QuestionSpecialtyVote from 'models/question_specialty_vote';
import dataLoader from 'dataloader';
import Specialty from 'models/specialty';
import Tag from 'models/tag';
import QuestionTagVote from 'models/question_tag_vote';

const batchSpecialties = async (ids: number[]) => {
  const specialties = await Specialty.query().findByIds(ids);
  return ids.map((id) => specialties.find((s) => s.id === id));
};

const batchTags = async (ids: number[]) => {
  const tags = await Tag.query().findByIds(ids);
  return ids.map((id) => tags.find((tag) => tag.id === id));
};

const batchTagVotes = async (ids: number[]) => {
  const tagVotes = await QuestionTagVote.query().findByIds(ids);
  return ids.map((id) => tagVotes.find((t) => t.id === id));
};

const batchSpecialtyVotes = async (ids: number[]) => {
  const specialtyVotes = await QuestionSpecialtyVote.query().findByIds(ids);
  return ids.map((id) => specialtyVotes.find((s) => s.id === id));
};

export const specialtyLoader = new dataLoader((ids: number[]) => batchSpecialties(ids), {
  cache: false
});
export const specialtyVoteLoader = new dataLoader((ids: number[]) => batchSpecialtyVotes(ids), {
  cache: false
});
export const tagLoader = new dataLoader((ids: number[]) => batchTags(ids), { cache: false });
export const tagVotesLoader = new dataLoader((ids: number[]) => batchTagVotes(ids), {
  cache: false
});
