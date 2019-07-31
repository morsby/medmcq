import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import * as actions from 'actions';
import { Form, TextArea, Button, Message } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

import QuestionCommentSingle from './QuestionCommentSingle';
import { makeToast } from 'actions';

/**
 * Viser kommentarer til et spørgsmål
 * Modtager alle props fra ../Question.js
 * @param {array} comments          Array af kommentarer til spørgsmålet
 * @param {string} newComment       Den nye kommentar
 * @param {func}  onCommentType     Funktion til at ændre kommentar-tekst
 * @param {object} user             Brugeren
 */
const QuestionComments = ({
  comments,
  user,
  privateComment,
  question,
  writeComment,
  editComment,
  type
}) => {
  let form;
  const [editCommentId, setEditCommentId] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onCommentPost = async () => {
    let isPrivate = type === 'private';
    let isAnonymous = false;
    setLoading(true);

    try {
      if (editCommentId) {
        await editComment(question.id, editCommentId, comment, isPrivate, isAnonymous);
        setEditCommentId(null);
      } else {
        await writeComment(question.id, comment, isPrivate, isAnonymous);
      }

      // TODO: Vent med at slette kommentar til den ER postet
      setComment('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(makeToast('toast.genericError', 'error'));
      console.log(error);
    }
  };

  const onEditComment = (comment) => {
    setEditCommentId(comment.id);
    setComment(comment.text);
  };

  if (user) {
    let skrivRet = editCommentId ? (
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
                name="comment"
                placeholder={translate('questionComments.write_a_comment')}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
            )}
          </Translate>
          {!privateComment && (
            <Message info>
              <Translate id="questionComments.public_comment_info" />
            </Message>
          )}
          {privateComment && (
            <Message info>
              <Translate id="questionComments.private_comment_info" />
            </Message>
          )}
          <Button
            onClick={onCommentPost}
            disabled={comment.length < 3 || loading}
            style={{ margin: '0.5em 1em 0.5em 0' }}
            loading={loading}
          >
            <Translate id="questionComments.comment" />
          </Button>
          {editCommentId && (
            <Button
              negative
              onClick={() => setEditCommentId(null)}
              disabled={loading}
              loading={loading}
            >
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
            key={c}
            commentId={c}
            questionId={question.id}
            type={type}
            onEditComment={onEditComment}
          />
        ))}
      </div>
      {form}
    </div>
  );
};

QuestionComments.propTypes = {
  comments: PropTypes.array,
  // I brug:
  user: PropTypes.object,
  privateComment: PropTypes.bool,
  question: PropTypes.object,
  writeComment: PropTypes.func,
  editComment: PropTypes.func,
  type: PropTypes.string
};

export default connect(
  null,
  actions
)(QuestionComments);
