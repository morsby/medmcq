import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
  comment,
  user,
  deleteComment,
  editComment
}) => {
  const [deleting, setDeleting] = useState(false);

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
            {comment.user[0].toUpperCase() + comment.user.substring(1)}
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
        {comment.userId === user.id && (
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
                    deleteComment(comment.id);
                    setDeleting(false);
                  }}
                >
                  <Icon name="trash" color="red" />
                  <Translate id="questionCommentSingle.yes" />
                </Menu.Item>
              </>
            )}
            <Menu.Item onClick={() => editComment(comment)}>
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
  comment: PropTypes.object,
  user: PropTypes.object,
  deleteComment: PropTypes.func,
  editComment: PropTypes.func
};

export default QuestionCommentSingle;
