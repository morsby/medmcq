import React, { useState } from 'react';
import CommentClass from 'classes/Comment';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { Icon, Loader } from 'semantic-ui-react';

export interface QuestionCommentLikeButtonProps {
  comment: CommentClass;
}

const QuestionCommentLikeButton: React.SFC<QuestionCommentLikeButtonProps> = ({ comment }) => {
  const user = useSelector((state: ReduxState) => state.auth.user);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    setLikeLoading(true);
    await CommentClass.like({ commentId: comment.id });
    setLikeLoading(false);
  };

  const likeButton = () => {
    if (likeLoading) return <Loader active inline size="mini" style={{ marginRight: '4px' }} />;
    if (user && comment.user.id !== user.id)
      return (
        <Icon
          name="thumbs up outline"
          color={
            comment.likes.findIndex((like) => like.userId === user.id) !== -1 ? 'green' : 'grey'
          }
          style={user.id ? { cursor: 'pointer' } : {}}
          onClick={handleLike}
        />
      );
    return <Icon disabled name="thumbs up outline" />; // If user is not logged in
  };

  return (
    <>
      {likeButton()}
      <span style={{ color: 'grey' }}>{comment.likes.length}</span>
    </>
  );
};

export default QuestionCommentLikeButton;
