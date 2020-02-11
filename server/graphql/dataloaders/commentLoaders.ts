import Comment from 'models/question_comment';
import dataLoader from 'dataloader';

// Batchers
const batchComments = async (ids: number[]) => {
  const comments = await Comment.query().findByIds(ids);
  return ids.map((id) => comments.find((comment) => comment.id === id));
};

// Loaders
export const commentsLoader = new dataLoader((ids: number[]) => batchComments(ids), {
  cache: false
});
