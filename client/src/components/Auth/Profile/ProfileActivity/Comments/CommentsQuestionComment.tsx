import React from 'react';
import { Comment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface CommentsQuestionCommentProps {
  commentId: number;
  type: 'private' | 'public';
}

const CommentsQuestionComment: React.SFC<CommentsQuestionCommentProps> = ({ commentId, type }) => {
  const comment = useSelector((state: ReduxState) =>
    state.questions.comments.find((comment) => comment.id === commentId)
  );
  const user = useSelector((state: ReduxState) => state.auth.user);

  if (!comment) return null;
  return (
    <Comment
      style={{
        borderLeft: comment.user.id === user.id ? '3px solid rgb(175, 175, 175)' : ''
      }}
    >
      <Comment.Content>
        <Comment.Author as="strong">{comment.user.username}</Comment.Author>
        <Comment.Metadata>{new Date(comment.createdAt).toLocaleString()}</Comment.Metadata>
        <Comment.Text>{comment.text}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default CommentsQuestionComment;
