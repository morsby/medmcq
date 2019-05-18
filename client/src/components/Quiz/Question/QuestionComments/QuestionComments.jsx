import React, { useState, useEffect } from 'react';
import QuestionCommentSingle from './QuestionCommentSingle';
import { Form, TextArea, Button, Message, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

const QuestionComments = ({
  user,
  isPrivateComment,
  comments,
  question,
  deleteComment,
  commentQuestion,
  editComment
}) => {
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState('');
  const selectedComments = isPrivateComment ? comments.privateComments : comments.publicComments;

  useEffect(() => {
    setAnonymous(false);
    setComment('');
  }, [user, isPrivateComment, comments]);

  /**
   * Poster en kommentar.
   * De brugte props (edit/commentQuestion) er fra redux.
   */
  const onCommentPost = () => {
    if (comment.length >= 3) {
      if (editingCommentId) {
        /**
         *  Hvis vi er ved at rette i en kommentar
         *  (dvs. editingComment = dennes id.)
         */
        editComment(question._id, editingCommentId, comment, isPrivateComment, anonymous);
      } else {
        /**
         *  Det er en ny kommentar
         */
        commentQuestion(question._id, comment, isPrivateComment, anonymous);
      }
      setAnonymous(false);
      setComment('');
      setEditingCommentId('');
    }
  };

  /**
   * Slet kommentar. Fra redux
   */
  const onDeleteComment = (comment_id) => {
    deleteComment(question._id, comment_id);
  };

  /**
   * Når der ønskes at ændre en kommentar.
   * Kaldes fra QuestionComments.js
   * @param  {object} comment Kommentaren der skal ændres.
   */
  const onEditComment = (comment) => {
    setComment(comment.comment);
    setEditingCommentId(comment._id);
    setAnonymous(comment.anonymous);
  };

  /**
   * Fortryder ændring af kommentar
   */
  const undoEditComment = () => {
    setComment('');
    setEditingCommentId('');
    setAnonymous(false);
  };

  let form;
  if (user) {
    let skrivRet = editingCommentId ? (
      <Translate id="questionComments.edit_a_comment" />
    ) : (
      <Translate id="questionComments.write_a_comment" />
    );
    form = (
      <div style={{ marginTop: '1em' }}>
        <h5>{skrivRet}</h5>

        <Form>
          <Translate>
            {({ translate }) => (
              <TextArea
                placeholder={translate('questionComments.write_a_comment')}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
            )}
          </Translate>
          {!isPrivateComment && (
            <Message info>
              <Translate id="questionComments.public_comment_info" />
            </Message>
          )}
          {isPrivateComment && (
            <Message info>
              <Translate id="questionComments.private_comment_info" />
            </Message>
          )}
          <Button
            onClick={onCommentPost}
            disabled={comment.length < 3}
            style={{ margin: '0.5em 1em 0.5em 0' }}
          >
            <Translate id="questionComments.comment" />
          </Button>
          {editingCommentId && (
            <Button negative onClick={undoEditComment}>
              <Translate id="questionComments.undo_edit" />
            </Button>
          )}
          {!isPrivateComment && (
            <Checkbox
              style={{ marginLeft: '1rem' }}
              label={
                <label>
                  <Translate id="questionComments.hide_username" />
                </label>
              }
              onChange={() => setAnonymous(!anonymous)}
              checked={anonymous}
            />
          )}
        </Form>
      </div>
    );
  } else {
    form = (
      <Message warning>
        <Translate id="questionComments.login_to_write" />
      </Message>
    );
  }
  return (
    <div>
      <div>
        {selectedComments.map((c) => (
          <QuestionCommentSingle
            key={c._id}
            comment={c}
            user={user}
            deleteComment={onDeleteComment}
            editComment={onEditComment}
            anonymous={anonymous}
          />
        ))}
      </div>
      {form}
    </div>
  );
};

QuestionComments.propTypes = {
  user: PropTypes.object,
  isPrivateComment: PropTypes.bool,
  comments: PropTypes.object,
  question: PropTypes.object,
  deleteComment: PropTypes.func,
  commentQuestion: PropTypes.func,
  editComment: PropTypes.func
};

export default QuestionComments;
