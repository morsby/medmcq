import dataLoader from 'dataloader';
import QuestionCommentLike from 'models/question_comment_like';

const batchLikesByCommentId = async (ids: number[]) => {
  const likes = await QuestionCommentLike.query().whereIn('commentId', ids);
  return ids.map((id) => likes.filter((like) => like.commentId === id));
};
const batchLikesByUserId = async (ids: number[]) => {
  const likes = await QuestionCommentLike.query().whereIn('userId', ids);
  return ids.map((id) => likes.filter((like) => like.commentId === id));
};

export const likesByCommentIdLoader = new dataLoader((ids: number[]) => batchLikesByCommentId(ids));
export const likesByUserIdLoader = new dataLoader((ids: number[]) => batchLikesByUserId(ids));
