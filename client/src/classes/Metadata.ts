import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import { store } from 'IndexApp';
import metadataReducer from 'redux/reducers/metadata';
import ExamSet from './ExamSet';
import Tag, { TagVote } from './Tag';
import Specialty, { SpecialtyVote } from './Specialty';
import questionsReducer from 'redux/reducers/question';

interface Metadata {
  examSets: ExamSet[];
  tags: Tag[];
  specialties: Specialty[];
}

class Metadata {
  static fetchById = async (id: number) => {
    const query = gql`
      query($id: Int!) {
        semester(id: $id) {
          examSets {
            id
            year
            season
            semester {
              id
            }
          }
          tags {
            id
            name
            semester {
              id
            }
            parent {
              id
            }
            questionCount
          }
          specialties {
            id
            name
            semester {
              id
            }
            questionCount
          }
        }
      }
    `;

    const semester = await Apollo.query<Metadata>('semester', query, { id });

    await store.dispatch(metadataReducer.actions.setMetadata(semester));
  };

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
            id
            tag {
              id
            }
            question {
              id
            }
            user {
              id
            }
            vote
          }
        }
      `;
    } else if (type === 'specialty') {
      name = 'voteSpecialty';
      mutation = gql`
        mutation($data: VoteInput) {
          voteSpecialty(data: $data) {
            id
            specialty {
              id
            }
            question {
              id
            }
            user {
              id
            }
            vote
          }
        }
      `;
    }

    const data = { questionId, metadataId, vote };
    const metadataVote = await Apollo.mutate(name, mutation, { data });

    if (type === 'specialty') {
      await store.dispatch(questionsReducer.actions.voteSpecialty(metadataVote as SpecialtyVote));
    } else if (type === 'tag') {
      await store.dispatch(questionsReducer.actions.voteTag(metadataVote as TagVote));
    }
  };

  static suggestTag = ({ tagName, questionId }: { tagName: string; questionId: number }) => {
    // TODO
  };
}

export default Metadata;
