import Question from './Question';

interface Tag {}

export interface TagVote {
  id: number;
  tag: Tag;
  question: Question;
  votes: number;
}

class Tag {}

export default Tag;
