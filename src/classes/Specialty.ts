import gql from 'graphql-tag';
import { Specialty as SpecialtyType } from 'types/generated';

interface Specialty extends SpecialtyType {}

class Specialty {
  static fragmentFull = gql`
    fragment Specialty on Specialty {
      id
      name
      semester {
        id
      }
      questionCount
    }
  `;

  static specialtyVoteFragment = gql`
    fragment SpecialtyVote on SpecialtyVote {
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
  `;
}

export default Specialty;
