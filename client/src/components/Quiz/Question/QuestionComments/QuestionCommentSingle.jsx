import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'actions';
import marked from 'marked';
import { Comment, Icon, Menu } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
/**
 * Component der viser den enkelte kommentar
 * Props fra QuestionComments.js.
 * @param {object}  comment       Selve kommentaren.
 * @param {object}  user          Brugeren.
 * @param {func}    deleteComment Funktion at slette kommentar
 * @param {func}    editComment   Funktion at ændre kommentar
 */
const QuestionCommentSingle = ({
  commentId,
  type,
  authors,
  privateComments = {},
  publicComments = {},
  user,
  onEditComment,
  deleteComment,
  questionId
}) => {
  const [deleting, setDeleting] = useState(false);
  let comment;
  if (type === 'public') {
    comment = publicComments[commentId];
  } else {
    comment = privateComments[commentId];
  }

  let author = authors[comment.userId];
  if (!user) user = {};
  return (
    <Comment
      key={comment.id}
      style={{
        border: '1px solid rgb(140,140,140)',
        borderRadius: '5px',
        marginTop: '1em',
        padding: '0.5em',
        paddingTop: 0
      }}
    >
      <Comment.Content>
        {!comment.anonymous && (
          <Comment.Author as="strong">
            {author.username[0].toUpperCase() + author.username.substring(1)}
          </Comment.Author>
        )}
        {comment.anonymous && (
          <Comment.Author as="strong">
            <Translate id="questionCommentSingle.anonymous" />
          </Comment.Author>
        )}
        <Comment.Metadata style={{ color: 'rgb(140, 140, 140)' }}>
          {new Date(comment.createdAt).toLocaleString('da-DK')}
        </Comment.Metadata>
        {comment.private ? (
          <Comment.Metadata style={{ color: 'rgb(140, 140, 140)' }}>
            <Translate id="question.private_comment" />
          </Comment.Metadata>
        ) : null}

        <Comment.Text
          style={{ marginTop: '1em', fontSize: '15px' }}
          dangerouslySetInnerHTML={{
            __html: marked(comment.text)
          }}
        />
        {author.id === user.id && (
          <Menu size="mini" icon="labeled" secondary>
            {!deleting && (
              <Menu.Item onClick={() => setDeleting(true)}>
                <Icon name="trash" color="red" />
                <Translate id="questionCommentSingle.delete" />
              </Menu.Item>
            )}
            {deleting && (
              <>
                <Menu.Item>
                  <Translate id="questionCommentSingle.delete_confirmation" />
                </Menu.Item>
                <Menu.Item onClick={() => setDeleting(false)}>
                  <Icon name="close" />
                  <Translate id="questionCommentSingle.no" />
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    deleteComment(questionId, comment.id);
                    setDeleting(false);
                  }}
                >
                  <Icon name="trash" color="red" />
                  <Translate id="questionCommentSingle.yes" />
                </Menu.Item>
              </>
            )}
            <Menu.Item onClick={() => onEditComment(comment)}>
              <Icon name="edit" color="yellow" />
              <Translate id="questionCommentSingle.edit" />
            </Menu.Item>
          </Menu>
        )}
      </Comment.Content>
    </Comment>
  );
};

QuestionCommentSingle.propTypes = {
  commentId: PropTypes.number,
  type: PropTypes.string,
  authors: PropTypes.object,
  privateComments: PropTypes.object,
  publicComments: PropTypes.object,
  user: PropTypes.object,
  onEditComment: PropTypes.func,
  deleteComment: PropTypes.func,
  questionId: PropTypes.number
};

const mapStateToProps = (state) => ({
  authors: state.questions.entities.users,
  publicComments: state.questions.entities.publicComments,
  privateComments: state.questions.entities.privateComments,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  actions
)(QuestionCommentSingle);
