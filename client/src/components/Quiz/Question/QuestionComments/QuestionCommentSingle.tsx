import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import marked from 'marked';
import { Comment as SemanticComment, Icon, Menu, Loader } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import Comment from 'classes/Comment';
import Question from 'classes/Question';
import { ReduxState } from 'redux/reducers';
import _ from 'lodash';

/**
 * Component der viser den enkelte kommentar
 * Props fra QuestionComments.js.
 * @param {object}  comment       Selve kommentaren.
 * @param {object}  user          Brugeren.
 * @param {func}    deleteComment Funktion at slette kommentar
 * @param {func}    editComment   Funktion at ændre kommentar
 */
export interface QuestionCommentSingleProps {
  comment: Comment;
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

  const handleLike = async () => {
    setLikeLoading(true);
    await Comment.like({ commentId: comment.id });
    setLikeLoading(false);
  };

  const handleDelete = async (commentId: number) => {
    await Comment.delete({ commentId });
  };

  return (
    <SemanticComment
      key={comment.id}
      style={{
        border: '1px solid rgb(140,140,140)',
        borderRadius: '5px',
        marginTop: '1em',
        padding: '0.5em',
        paddingTop: 0
      }}
    >
      <SemanticComment.Content>
        {comment.isAnonymous ? (
          <SemanticComment.Author as="strong">
            <Translate id="questionCommentSingle.anonymous" />
          </SemanticComment.Author>
        ) : (
          <SemanticComment.Author as="strong">
            {comment.user.username[0].toUpperCase() + comment.user.username.substring(1)}{' '}
            {!comment.isPrivate && mostLiked && <Icon color="green" name="star outline" />}
          </SemanticComment.Author>
        )}
        <SemanticComment.Metadata style={{ color: 'rgb(140, 140, 140)' }}>
          {new Date(comment.createdAt).toLocaleString('da-DK', {
            timeStyle: 'short',
            dateStyle: 'short'
          } as any)}
          {!comment.isPrivate && (
            <>
              <br />
              {likeLoading && <Loader active inline size="mini" />}
              {!likeLoading && user && comment.user.id !== user.id ? (
                <Icon
                  name="thumbs up outline"
                  color={_.findIndex(comment.likes, { userId: user.id }) !== -1 ? 'green' : 'grey'}
                  style={user.id ? { cursor: 'pointer' } : {}}
                  onClick={handleLike}
                />
              ) : (
                <Icon disabled name="thumbs up outline" />
              )}
              <span style={{ color: 'grey' }}>{comment.likes.length}</span>
            </>
          )}
        </SemanticComment.Metadata>
        {comment.isPrivate && (
          <SemanticComment.Metadata style={{ color: 'rgb(140, 140, 140)' }}>
            <Translate id="question.private_comment" />
          </SemanticComment.Metadata>
        )}
        <SemanticComment.Text
          style={{ marginTop: '1em', fontSize: '15px' }}
          dangerouslySetInnerHTML={{
            __html: marked(comment.text)
          }}
        />
        {user && user.id === comment.user.id && !likeLoading && (
          <Menu size="tiny" icon="labeled" secondary>
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
                    handleDelete(comment.id);
                    setDeleting(false);
                  }}
                >
                  <Icon name="trash" color="red" />
                  <Translate id="questionCommentSingle.yes" />
                </Menu.Item>
              </>
            )}
            <Menu.Item onClick={() => handleEdit(comment)}>
              <Icon name="edit" color="yellow" />
              <Translate id="questionCommentSingle.edit" />
            </Menu.Item>
          </Menu>
        )}
      </SemanticComment.Content>
    </SemanticComment>
  );
};

export default QuestionCommentSingle;
