import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import QuestionCommentLike from 'models/question_comment_like';

export const typeDefs = gql`
  type Comment {
    id: Int
    text: String
    private: Boolean
    user: User
    createdAt: String
    updatedAt: String
    likes: [Like]
    question: Question
  }
`;

export const resolvers = {
  Comment: {
    id: ({ id }) => id,
    text: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.text;
    },
    private: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.private;
    },
    user: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return { id: comment.userId };
    },
    createdAt: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.createdAt;
    },
    updatedAt: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.updatedAt;
    },
    likes: async ({ id }, _, ctx: Context) => {
      const likes = await QuestionCommentLike.query().where({ commentId: id });
      return likes.map((like) => ({ id: [like.commentId, like.userId] }));
    },
    question: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return { id: comment.questionId };
    }
  }
};
