import Question from './Question';
import Semester from 'classes/Semester';

interface Tag {
  id: number;
  name: string;
  semester: Partial<Semester>;
  parent: Partial<Tag>;
  questionCount: number;
}

export interface TagVote {
  id: number;
  tag: Tag;
  question: Question;
  votes: number;
}

class Tag {}

export default Tag;
