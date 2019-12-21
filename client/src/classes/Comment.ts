import User from 'classes/User';
import Like from './Like';
import Question from 'classes/Question.js';
import { gql } from 'apollo-server-express';
import Apollo from './Apollo';

interface Comment {
  id: number;
  text: string;
  isPrivate: boolean;
  isAnonymous: boolean;
  user: User;
  likes: Like[];
  question: Question;
  createdAt: Date;
}

interface CommentInput {
  questionId: number;
  commentId: number;
  isPrivate: boolean;
  isAnonymous: boolean;
}

class Comment {
  static fragment = gql`
    fragment FullComment on Comment {
      id
      text
      isPrivate
      isAnonymous
      createdAt
      user {
        id
        username
      }
      likes {
        commentId
        userId
      }
      question {
        id
      }
    }
  `;

  static add = (data: CommentInput) => {};

  static delete = async ({ commentId }: { commentId: number }) => {
    const mutation = gql`
      mutation($commentId: Int!) {
        deleteComment(commentId: $commentId)
      }
    `;

    await Apollo.mutate('deleteComment', mutation, { commentId });
  };

  static edit = (data: CommentInput) => {};

  static like = async ({ commentId }: { commentId: number }) => {
    const mutation = gql`
      mutation($commentId: Int!) {
        likeComment(commentId: $commentId) {
          ...FullComment
        }
      }
      ${Comment.fragment}
    `;

    const comment = await Apollo.mutate<Comment>('likeComment', mutation, { commentId });

    return comment;
  };
}

export default Comment;
