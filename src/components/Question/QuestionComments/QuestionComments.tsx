import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Message, Checkbox, Comment } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

import QuestionCommentSingle from './QuestionCommentSingle';
import makeToast from 'redux/actions/makeToast';
import { ReduxState } from 'redux/reducers';
import CommentClass from 'classes/Comment';
import _ from 'lodash';
import TextArea from 'antd/lib/input/TextArea';

export interface QuestionCommentsProps {
  type: 'private' | 'public';
}

/**
 * Viser kommentarer til et spørgsmål
 */
const QuestionComments: React.SFC<QuestionCommentsProps> = ({ type }) => {
  const [editCommentId, setEditCommentId] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: ReduxState) => state.auth.user);
  const currentQuestionNumber = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionNumber]
  );
  const comments = useSelector((state: ReduxState) =>
    state.questions.comments.filter((comment) => comment.question.id === question.id)
  );
  const publicComments = comments.filter((comment) => !comment.isPrivate);
  const privateComments = comments
    .filter((comment) => comment.isPrivate)
    .filter((c) => c.user.id === user.id);
  const mostLiked = _.maxBy(publicComments, (comment) => comment.likes.length);
  let form;

  useEffect(() => {
    setIsAnonymous(false);
    setComment('');
  }, [question]);

  // Hvis brugeren skifter fra public til privat (eller omvendt), mens der skrives
  useEffect(() => {
    setIsAnonymous(false);
  }, [type]);

  const onCommentPost = async () => {
    let isPrivate = type === 'private';
    setLoading(true);

    try {
      if (editCommentId) {
        await CommentClass.edit({
          text: comment,
          questionId: question.id,
          id: editCommentId,
          isAnonymous,
          isPrivate
        });
        setEditCommentId(null);
      } else {
        await CommentClass.add({
          text: comment,
          questionId: question.id,
          isPrivate,
          isAnonymous
        });
      }

      setComment('');
      setIsAnonymous(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(makeToast('toast.genericError', 'error'));
    }
  };

  const handleEditComment = (comment: CommentClass) => {
    setEditCommentId(comment.id);
    setComment(comment.text);
    setIsAnonymous(!!comment.isAnonymous);
  };

  const undoEdit = () => {
    setComment('');
    setEditCommentId(null);
    setIsAnonymous(false);
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
              <>
                <TextArea
                  name="comment"
                  placeholder={translate('questionComments.write_a_comment') as string}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  autoSize={{ minRows: 3 }}
                />
                <div style={{ textAlign: 'right' }}>
                  <a
                    style={{ color: 'grey' }}
                    href="https://www.markdownguide.org/cheat-sheet/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Translate id="questionComments.supportsMarkdown" />
                  </a>
                </div>
              </>
            )}
          </Translate>
          {type === 'public' && (
            <Message info>
              <Translate id="questionComments.public_comment_info" />
            </Message>
          )}
          {type === 'private' && (
            <Message info>
              <Translate id="questionComments.private_comment_info" />
            </Message>
          )}
          <Button
            onClick={onCommentPost}
            disabled={comment.length < 3 || loading}
            loading={loading}
          >
            <Translate id="questionComments.comment" />
          </Button>
          {editCommentId && (
            <Button negative onClick={undoEdit} disabled={loading} loading={loading}>
              <Translate id="questionComments.undo_edit" />
            </Button>
          )}
          {type === 'public' && (
            <Translate>
              {({ translate }) => (
                <Checkbox
                  style={{ marginLeft: '5px' }}
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  label={translate('questionComments.anonymous')}
                />
              )}
            </Translate>
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
    <>
      <Comment.Group as="div" style={{ maxWidth: '100%' }}>
        {type === 'private' &&
          privateComments.map((c) => (
            <QuestionCommentSingle key={c.id} comment={c} handleEdit={handleEditComment} />
          ))}
        {type === 'public' &&
          publicComments.map((c) => (
            <QuestionCommentSingle
              key={c.id}
              comment={c}
              handleEdit={handleEditComment}
              mostLiked={
                !c.isPrivate &&
                mostLiked.likes.length > 0 &&
                c.likes.length === mostLiked.likes.length
              }
            />
          ))}
      </Comment.Group>
      {form}
    </>
  );
};

export default QuestionComments;
