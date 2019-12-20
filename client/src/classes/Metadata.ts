import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import { store } from 'IndexApp';
import metadataReducer from 'redux/reducers/metadata';
import ExamSet from './ExamSet';
import Tag from './Tag';
import Specialty from './Specialty';

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

    await store.dispatch(
      metadataReducer.actions.setMetadata({
        tags: semester.tags,
        specialties: semester.specialties,
        examSets: semester.examSets
      })
    );
  };
}

export default Metadata;
