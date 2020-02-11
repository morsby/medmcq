import dataLoader from 'dataloader';
import QuestionCommentLike from 'models/question_comment_like';

const batchLikes = async (ids: [number, number][]) => {
  const likes = await QuestionCommentLike.query().findByIds(ids);
  return ids.map((id) => likes.find((like) => id[0] === like.commentId && id[1] === like.userId));
};

export const likesLoader = new dataLoader((ids: [number, number][]) => batchLikes(ids), {
  cache: false
});
