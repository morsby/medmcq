import gql from 'graphql-tag';
import API from './API.class';
import { store } from 'IndexApp';
import metadataReducer from 'redux/reducers/metadata';
import ExamSet from './ExamSet';
import Specialty from './Specialty';
import Tag from './Tag';
import { Semester as SemesterType } from 'types/generated';

interface Semester extends SemesterType {}

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
          examSets {
            ...ExamSet
          }
          tags {
            ...Tag
          }
          specialties {
            ...Specialty
          }
        }
      }
      ${ExamSet.fragmentFull}
      ${Tag.fragmentFull}
      ${Specialty.fragmentFull}
    `;

    const semesters = await API.query<Semester[]>('semesters', query);

    await store.dispatch(metadataReducer.actions.setSemesters(semesters));
  };
}

export default Semester;
