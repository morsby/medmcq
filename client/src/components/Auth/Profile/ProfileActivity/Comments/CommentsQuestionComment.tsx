import React from 'react';
import { Comment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { IReduxState } from 'reducers/index.js';

export interface CommentsQuestionCommentProps {
  commentId: number;
  type: string;
}

const CommentsQuestionComment: React.SFC<CommentsQuestionCommentProps> = ({
  commentId,
  type = 'public'
}) => {
  const questions = useSelector((state: IReduxState) => state.questions);
  const user = useSelector((state: IReduxState) => state.auth.user);

  const { users } = questions.entities;
  const comment = questions.entities[`${type}Comments`][commentId];
  const username = users[commentId] ? users[commentId].username : user.username;

  if (!comment) return null;
  return (
    <Comment
      style={{
        borderLeft: comment.user.id === user.id ? '3px solid rgb(175, 175, 175)' : ''
      }}
    >
      <Comment.Content>
        <Comment.Author as="strong">{username}</Comment.Author>
        <Comment.Metadata>{new Date(comment.createdAt).toLocaleString()}</Comment.Metadata>
        <Comment.Text>{comment.text}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default CommentsQuestionComment;
