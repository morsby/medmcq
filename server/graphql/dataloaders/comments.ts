import Comment from '../../models/question_comment';

export const commentByIds = async (ids: number[]) => {
  const comments = await Comment.query().whereIn('id', ids);
  return ids.map((id) => comments.find((x) => x.id === id));
};

export const commentByQuestionIdsAndUser = async (questionIds: number[], userId: number) => {
  const comments = await Comment.query()
    .whereIn('questionId', questionIds)
    .andWhere((builder) => builder.where('private', false).orWhere({ userId: userId }))
    .orderBy('id', 'asc');

  return questionIds.map((id) => comments.filter((x) => x.questionId === id));
};
