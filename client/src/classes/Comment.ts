import User from 'classes/User';
import Like from './Like';
import Question from 'classes/Question.js';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import { store } from 'IndexApp';
import questionsReducer from 'redux/reducers/question';

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
  id?: number;
  text: string;
  questionId: number;
  isPrivate: boolean;
  isAnonymous: boolean;
}

class Comment {
  static fragmentFull = gql`
    fragment Comment on Comment {
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

  static add = async (data: CommentInput) => {
    const mutation = gql`
      mutation($data: CommentInput) {
        addComment(data: $data) {
          ...Comment
        }
      }
      ${Comment.fragmentFull}
    `;

    const comment = await Apollo.mutate<Comment>('addComment', mutation, { data });
    store.dispatch(questionsReducer.actions.addComment({ comment }));
  };

  static delete = async ({ commentId }: { commentId: number }) => {
    const mutation = gql`
      mutation($commentId: Int!) {
        deleteComment(commentId: $commentId)
      }
    `;

    await Apollo.mutate('deleteComment', mutation, { commentId });
    store.dispatch(questionsReducer.actions.removeComment({ commentId }));
  };

  static edit = async (data: CommentInput) => {
    const mutation = gql`
      mutation($data: CommentInput) {
        editComment(data: $data) {
          ...Comment
        }
      }
      ${Comment.fragmentFull}
    `;

    const comment = await Apollo.mutate<Comment>('editComment', mutation, { data });
    store.dispatch(questionsReducer.actions.editComment({ comment }));
  };

  static like = async ({ commentId }: { commentId: number }) => {
    const mutation = gql`
      mutation($commentId: Int!) {
        likeComment(commentId: $commentId) {
          ...Comment
        }
      }
      ${Comment.fragmentFull}
    `;

    const comment = await Apollo.mutate<Comment>('likeComment', mutation, { commentId });
    store.dispatch(questionsReducer.actions.editComment({ comment }));
  };
}

export default Comment;
