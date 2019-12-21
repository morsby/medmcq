import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import QuestionCommentLike from 'models/question_comment_like';
import QuestionComment from 'models/question_comment';

export const typeDefs = gql`
  type Comment {
    id: Int
    text: String
    isPrivate: Boolean
    isAnonymous: Boolean
    user: User
    createdAt: String
    updatedAt: String
    likes: [Like]
    question: Question
  }

  extend type Mutation {
    likeComment(commentId: Int!): Comment
    deleteComment(commentId: Int!): String
  }
`;

export const resolvers = {
  Mutation: {
    likeComment: async (root, { commentId }, ctx: Context) => {
      if (!ctx.user) throw new Error('Must be logged in to like');
      const userId = ctx.user.id;

      const alreadyLiked = await QuestionCommentLike.query().where({
        commentId,
        userId: ctx.user.id
      });
      if (alreadyLiked) {
        await QuestionCommentLike.query()
          .where({ commentId, userId })
          .delete();
      } else {
        await QuestionCommentLike.query().insert({ commentId, userId });
      }

      return { id: commentId };
    },
    deleteComment: async (root, {commentId}, ctx: Context) => {
      const comment = QuestionComment.query().where({commentId, userId: ctx.user.id}).delete();
      if (!comment) throw new Error("Comment not found");
      return "Successfully deleted"
    }
  },

  Comment: {
    id: ({ id }) => id,
    text: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.text;
    },
    isPrivate: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.private;
    },
    isAnonymous: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return !!comment.anonymous;
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
