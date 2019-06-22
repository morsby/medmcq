import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

const CommentsQuestionComment = ({ commentId, user = {}, questions = {}, type = 'public' }) => {
  let { users } = questions.entities;
  let comment = questions.entities[`${type}Comments`][commentId];
  let username = comment.user ? users[comment.userId].username : user.username;
  return (
    <Comment
      style={{
        borderLeft: (comment.user || {}).id === user.id ? '3px solid rgb(175, 175, 175)' : ''
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

CommentsQuestionComment.propTypes = {
  commentId: PropTypes.number,
  questions: PropTypes.object,
  user: PropTypes.object,
  type: PropTypes.string
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  questions: state.questions
});

export default connect(
  mapStateToProps,
  null
)(CommentsQuestionComment);
