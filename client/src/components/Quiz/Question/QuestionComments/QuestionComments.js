import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button, Message } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

import QuestionCommentSingle from './QuestionCommentSingle';

/**
 * Viser kommentarer til et spørgsmål
 * Modtager alle props fra ../Question.js
 * @param {array} comments          Array af kommentarer til spørgsmålet
 * @param {string} newComment       Den nye kommentar
 * @param {func}  onCommentType     Funktion til at ændre kommentar-tekst
 * @param {func} onCommentPost      Funktion der poster kommentar
 * @param {func} onDeleteComment    Funktion der sletter kommentar
 * @param {func} onEditComment      Funktion til at åbne ændring af kommentar
 * @param {string} editingComment   id til ændret kommentar. false hvis ny kommentar
 * @param {func} undoEditComment           Funktion der fortryder ændring / starter ny kommentar
 * @param {object} user             Brugeren
 */
const QuestionComments = ({
  comments,
  newComment,
  onCommentType,
  onCommentPost,
  onDeleteComment,
  onEditComment,
  editingComment,
  undoEditComment,
  user
}) => {
  let form;
  if (user) {
    let skrivRet = editingComment ? (
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
                name="newComment"
                placeholder={translate('questionComments.write_a_comment')}
                onChange={onCommentType}
                value={newComment}
              />
            )}
          </Translate>
          <Message info>
            <Translate id="questionComments.username_will_be_shown" />
          </Message>
          <Button
            onClick={onCommentPost}
            disabled={newComment.length < 3}
            style={{ margin: '0.5em 1em 0.5em 0' }}
          >
            <Translate id="questionComments.comment" />
          </Button>
          {editingComment && (
            <Button negative onClick={undoEditComment}>
              <Translate id="questionComments.undo_edit" />
            </Button>
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
        {comments.map((c) => (
          <QuestionCommentSingle
            key={c._id}
            comment={c}
            user={user}
            deleteComment={onDeleteComment}
            editComment={onEditComment}
          />
        ))}
      </div>
      {form}
    </div>
  );
};

QuestionComments.propTypes = {
  comments: PropTypes.array,
  newComment: PropTypes.string,
  onCommentType: PropTypes.func,
  onCommentPost: PropTypes.func,
  onDeleteComment: PropTypes.func,
  onEditComment: PropTypes.func,
  editingComment: PropTypes.string,
  undoEditComment: PropTypes.func,
  user: PropTypes.object
};

export default QuestionComments;
