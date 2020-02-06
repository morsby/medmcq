import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import { store } from 'IndexApp';
import metadataReducer from 'redux/reducers/metadata';
import ExamSet from './ExamSet';
import Tag, { TagVote } from './Tag';
import Specialty, { SpecialtyVote } from './Specialty';
import questionsReducer from 'redux/reducers/question';
import Question from './Question';

interface Metadata {
  examSets: ExamSet[];
  tags: Tag[];
  specialties: Specialty[];
}

class Metadata {
  static vote = async ({
    type,
    questionId,
    metadataId,
    vote
  }: {
    type: 'tag' | 'specialty';
    questionId: number;
    metadataId: number;
    vote?: number;
  }) => {
    let mutation;
    let name;
    if (type === 'tag') {
      name = 'voteTag';
      mutation = gql`
        mutation($data: VoteInput) {
          voteTag(data: $data) {
            ...Question
          }
        }
        ${Question.fullFragment}
      `;
    } else if (type === 'specialty') {
      name = 'voteSpecialty';
      mutation = gql`
        mutation($data: VoteInput) {
          voteSpecialty(data: $data) {
            ...Question
          }
        }
        ${Question.fullFragment}
      `;
    }

    const data = { questionId, metadataId, vote };
    const question = await Apollo.mutate<Question>(name, mutation, { data });

    if (type === 'specialty') {
      await store.dispatch(questionsReducer.actions.setQuestion(question));
    } else if (type === 'tag') {
      await store.dispatch(questionsReducer.actions.setQuestion(question));
    }
  };

  static suggestTag = ({ tagName, questionId }: { tagName: string; questionId: number }) => {
    // TODO
  };
}

export default Metadata;
