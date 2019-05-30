import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

const CommentsQuestionComment = ({ comment, user = {} }) => {
  let username = comment.user ? comment.user.username : user.username;
  return (
    <Comment
      style={{
        borderLeft: (comment.user || {}).id === user.id ? '3px solid rgb(175, 175, 175)' : ''
      }}
    >
      <Comment.Content>
        <Comment.Author as='strong'>{username}</Comment.Author>
        <Comment.Metadata>{new Date(comment.createdAt).toLocaleString()}</Comment.Metadata>
        <Comment.Text>{comment.text}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

CommentsQuestionComment.propTypes = {
  comment: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  null
)(CommentsQuestionComment);
