import gql from 'graphql-tag';
import API from './API.class';
import { store } from 'IndexApp';
import questionsReducer from 'redux/reducers/question';
import { Comment as CommentType, CommentInput } from 'types/generated';

interface Comment extends CommentType {}

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

    const comment = await API.mutate<Comment>('addComment', mutation, { data });
    store.dispatch(questionsReducer.actions.addComment({ comment }));
  };

  static delete = async ({ commentId }: { commentId: number }) => {
    const mutation = gql`
      mutation($commentId: Int!) {
        deleteComment(commentId: $commentId)
      }
    `;

    await API.mutate('deleteComment', mutation, { commentId });
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

    const comment = await API.mutate<Comment>('editComment', mutation, { data });
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

    const comment = await API.mutate<Comment>('likeComment', mutation, { commentId });
    store.dispatch(questionsReducer.actions.editComment({ comment }));
  };
}

export default Comment;
