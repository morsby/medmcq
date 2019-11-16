import Semester from './Semester';
import client from 'apolloClient';
import { gql } from 'apollo-boost';

interface ExamSet {
  id: number;
  year: number;
  season: string;
  semester: Semester;
  createdAt: string;
  updatedAt: string;
}

class ExamSet {
  static fetchAll = async () => {
    const res = await client.query<{ examSets: ExamSet[] }>({
      query: gql`
        query {
          examSets {
            id
            year
            season
            semester {
              id
            }
          }
        }
      `
    });

    return res.data.examSets;
  };
}

export default ExamSet;
