import gql from 'graphql-tag';
import { ExamSet as ExamSetType } from 'types/generated';
import API from './API.class';

interface ExamSet extends ExamSetType {}

class ExamSet {
  static fragmentFull = gql`
    fragment ExamSet on ExamSet {
      id
      year
      season
      reexam
      name
      semester {
        id
      }
      questionCount
      hadHelp
    }
  `;

  static fetchAll = async () => {
    const query = gql`
      query {
        examSets {
          ...ExamSet
        }
      }
      ${ExamSet.fragmentFull}
    `;

    const examSets = await API.query<ExamSet[]>('examSets', query);
    return examSets;
  };
}

export default ExamSet;
