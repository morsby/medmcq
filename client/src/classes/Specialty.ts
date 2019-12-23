import User from 'classes/User';
import Question from './Question';
import Semester from './Semester';

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

class Specialty {}

export default Specialty;
