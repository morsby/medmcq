import gql from 'graphql-tag';
import API from './API.class';
import { store } from 'IndexApp';
import ExamSet from './ExamSet';
import Tag from './Tag';
import Specialty from './Specialty';
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
    const question = await API.mutate<Question>(name, mutation, { data });

    if (type === 'specialty') {
      await store.dispatch(questionsReducer.actions.addQuestion(question));
    } else if (type === 'tag') {
      await store.dispatch(questionsReducer.actions.addQuestion(question));
    }
  };
}

export default Metadata;
