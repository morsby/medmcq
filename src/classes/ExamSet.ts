import client from 'apolloClient';
import { gql } from 'apollo-boost';
import { ExamSet as ExamSetType } from 'types/generated';

interface ExamSet extends ExamSetType {}

class ExamSet {
  static fragmentFull = gql`
    fragment ExamSet on ExamSet {
      id
      year
      season
      semester {
        id
      }
      questionCount
    }
  `;

  static fetchAll = async () => {
    const res = await client.query<{ examSets: ExamSet[] }>({
      query: gql`
        query {
          examSets {
            ...ExamSet
          }
        }
        ${ExamSet.fragmentFull}
      `
    });

    return res.data.examSets;
  };
}

export default ExamSet;
