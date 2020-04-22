import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import { Tag as TagType } from 'types/generated';

interface Tag extends TagType {}

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
