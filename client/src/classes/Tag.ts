import Question from './Question';
import Semester from 'classes/Semester';
import { gql } from 'apollo-boost';
import User from './User';
import Apollo from './Apollo';

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
  vote: number;
  user: User;
}

class Tag {
  static fragmentFull = gql`
    fragment Tag on Tag {
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
  `;

  static tagVoteFragment = gql`
    fragment TagVote on TagVote {
      id
      tag {
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

  static suggest = async (data: { tagName: string; questionId: number }) => {
    const mutation = gql`
      mutation($tagName: String!, $questionId: Int!) {
        suggestTag(tagName: $tagName, questionId: $questionId)
      }
    `;

    await Apollo.mutate('suggestTag', mutation, data);
  };
}

export default Tag;
