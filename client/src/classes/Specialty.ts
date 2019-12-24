import User from 'classes/User';
import Question from './Question';
import Semester from './Semester';
import { gql } from 'apollo-boost';

interface Specialty {
  id: number;
  name: string;
  semester: Partial<Semester>;
  questionCount: number;
}

export interface SpecialtyVote {
  id: number;
  specialty: Specialty;
  question: Question;
  user: User;
  vote: number;
}

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
