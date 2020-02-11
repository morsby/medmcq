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
    likes: [Like]
    question: Question
    createdAt: String
    updatedAt: String
  }

  input CommentInput {
    id: Int
    text: String!
    isPrivate: Boolean
    isAnonymous: Boolean
    questionId: Int
  }

  extend type Mutation {
    addComment(data: CommentInput): Comment
    editComment(data: CommentInput): Comment
    likeComment(commentId: Int!): Comment
    deleteComment(commentId: Int!): String
  }
`;

export const resolvers = {
  Mutation: {
    likeComment: async (root, { commentId }, ctx: Context) => {
      if (!ctx.user) throw new Error('Must be logged in to like');
      const userId = ctx.user.id;

      const alreadyLiked = await QuestionCommentLike.query().findOne({
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
    deleteComment: async (root, { commentId }, ctx: Context) => {
      const comment = await QuestionComment.query()
        .where({ id: commentId, userId: ctx.user.id })
        .delete();
      if (!comment) throw new Error('Comment not found');
      return 'Successfully deleted';
    },
    addComment: async (root, { data }, ctx: Context) => {
      const { text, isPrivate, isAnonymous, questionId } = data;
      const comment = await QuestionComment.query().insertAndFetch({
        text,
        private: isPrivate,
        anonymous: isAnonymous,
        questionId,
        userId: ctx.user.id
      });
      return { id: comment.id };
    },
    editComment: async (root, { data }, ctx: Context) => {
      const { id, text, isPrivate, isAnonymous, questionId } = data;
      const exists = await QuestionComment.query().findOne({ id, userId: ctx.user.id });
      if (exists) {
        const comment = await exists
          .$query()
          .updateAndFetch({ text, private: isPrivate, anonymous: isAnonymous, questionId });

        return { id: comment.id };
      }
      throw new Error('Comment not found');
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
      return comment.createdAt.toISOString();
    },
    updatedAt: async ({ id }, _, ctx: Context) => {
      const comment = await ctx.commentLoaders.commentsLoader.load(id);
      return comment.updatedAt.toISOString();
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
