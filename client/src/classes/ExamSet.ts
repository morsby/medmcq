import Semester from './Semester';
import client from 'apolloClient';
import { gql } from 'apollo-boost';

interface ExamSet {
  id: number;
  year: number;
  season: string;
  semester: Semester;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

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
