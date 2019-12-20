import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import { store } from 'IndexApp';
import metadataReducer from 'redux/reducers/metadata';

interface Semester {
  id: number;
  value: number;
  name: string;
  shortName: string;
  questionCount: number;
}

class Semester {
  static fetchAll = async () => {
    const query = gql`
      query {
        semesters {
          id
          value
          name
          shortName
          questionCount
        }
      }
    `;

    const semesters = await Apollo.query<Semester[]>('semesters', query);

    await store.dispatch(metadataReducer.actions.setSemesters(semesters));
  };
}

export default Semester;
