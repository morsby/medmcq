import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import marked from 'marked';
import { Comment, Icon } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import CommentClass from 'classes/Comment';
import Question from 'classes/Question';
import { ReduxState } from 'redux/reducers';
import _ from 'lodash';
import QuestionCommentLikeButton from './QuestionCommentLikeButton';

/**
 * Component der viser den enkelte kommentar
 * Props fra QuestionComments.js.
 * @param {object}  comment       Selve kommentaren.
 * @param {object}  user          Brugeren.
 * @param {func}    deleteComment Funktion at slette kommentar
 * @param {func}    editComment   Funktion at ændre kommentar
 */
export interface QuestionCommentSingleProps {
  comment: CommentClass;
  question: Question;
  type: 'private' | 'public';
  mostLiked?: boolean;
  handleEdit: Function;
}

const QuestionCommentSingle: React.SFC<QuestionCommentSingleProps> = ({
  comment,
  mostLiked,
  handleEdit
}) => {
  const [deleting, setDeleting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const user = useSelector((state: ReduxState) => state.auth.user);

  const handleDelete = async (commentId: number) => {
    await CommentClass.delete({ commentId });
  };

  return (
    <Comment
      key={comment.id}
      style={{
        border: '1px solid rgb(140,140,140)',
        borderRadius: '5px',
        padding: '0.5em',
        paddingTop: 0
      }}
    >
      <Comment.Content>
        <Comment.Author as="strong">
          {comment.isAnonymous ? (
            <Translate id="questionCommentSingle.anonymous" />
          ) : (
            comment.user.username.toTitleCase()
          )}{' '}
          {!comment.isPrivate && mostLiked && <Icon color="green" name="star outline" />}
        </Comment.Author>
        <Comment.Metadata>
          <div>
            {!comment.isPrivate && <QuestionCommentLikeButton comment={comment} />}
            {comment.isPrivate && <Translate id="question.private_comment" />}
          </div>
          <div style={{ marginLeft: '1em' }}>
            {new Date(comment.createdAt).toLocaleString('da-DK', {
              timeStyle: 'short',
              dateStyle: 'short'
            } as any)}
          </div>
        </Comment.Metadata>
        <Comment.Text
          style={{ marginTop: '1em', fontSize: '15px' }}
          dangerouslySetInnerHTML={{
            __html: marked(comment.text)
          }}
        />
        <Comment.Actions>
          {user && user.id === comment.user.id && !likeLoading && (
            <>
              {!deleting && (
                <Comment.Action onClick={() => setDeleting(true)}>
                  <Icon name="trash" color="red" />
                  <Translate id="questionCommentSingle.delete" />
                </Comment.Action>
              )}
              {deleting && (
                <>
                  <span>
                    <Translate id="questionCommentSingle.delete_confirmation" />
                  </span>
                  <Comment.Action onClick={() => setDeleting(false)}>
                    <Icon name="close" />
                    <Translate id="questionCommentSingle.no" />
                  </Comment.Action>
                  <Comment.Action
                    onClick={() => {
                      handleDelete(comment.id);
                      setDeleting(false);
                    }}
                  >
                    <Icon name="trash" color="red" />
                    <Translate id="questionCommentSingle.yes" />
                  </Comment.Action>
                </>
              )}
              <Comment.Action onClick={() => handleEdit(comment)}>
                <Icon name="edit" color="yellow" />
                <Translate id="questionCommentSingle.edit" />
              </Comment.Action>
            </>
          )}
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );
};

export default QuestionCommentSingle;
