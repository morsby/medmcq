import client from 'apolloClient';
import { gql } from 'apollo-boost';

interface Semester {
  id: number;
  value: number;
  name: string;
  shortName: string;
}

class Semester {
  static fetchAll = async () => {
    const res = await client.query<{ semesters: Semester[] }>({
      query: gql`
        query {
          semesters {
            id
            value
            name
            shortName
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
      `
    });

    return res.data.semesters;
  };
}

export default Semester;
