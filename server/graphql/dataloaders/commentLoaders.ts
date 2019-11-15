import Comment from 'models/question_comment';
import dataLoader from 'dataloader';

interface commentOptions {
  isPrivate: boolean;
}

// Batchers
const batchComments = async (ids: number[]) => {
  const comments = await Comment.query().findByIds(ids);
  return ids.map((id) => comments.find((comment) => comment.id === id));
};
const batchCommentsByQuestionId = async (ids: number[], options: commentOptions) => {
  const isPrivate = options.isPrivate ? 1 : 0;
  const publicComments = await Comment.query()
    .whereIn('questionId', ids)
    .where({ private: isPrivate });
  return ids.map((id) => publicComments.filter((comment) => comment.id === id));
};

// Loaders
export const commentsLoader = new dataLoader((ids: number[]) => batchComments(ids));
export const commentsByQuestionIdLoader = (options: commentOptions) =>
  new dataLoader((ids: number[]) => batchCommentsByQuestionId(ids, options));
