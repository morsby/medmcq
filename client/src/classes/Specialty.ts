interface Specialty {}
import User from 'classes/User';
import Question from './Question';

export interface SpecialtyVote {
  id: number;
  specialty: Specialty;
  question: Question;
  user: User;
  value: number;
}

class Specialty {}

export default Specialty;
