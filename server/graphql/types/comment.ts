import { gql } from 'apollo-server-express';
import QuestionCommentLike from 'models/question_comment_like';
import QuestionComment from 'models/question_comment';
import { Resolvers } from 'types/resolvers-types';
import Notification from 'models/notification.class';
const domain =
  process.env.NODE_ENV === 'production' ? 'https://medmcq.au.dk' : 'http://localhost:3000';

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

export const resolvers: Resolvers = {
  Mutation: {
    likeComment: async (root, { commentId }, ctx) => {
      if (!ctx.user) throw new Error('Must be logged in to like');
      const userId = ctx.user.id;

      const alreadyLiked = await QuestionCommentLike.query().findOne({
        commentId,
        userId: ctx.user.id
      });
      if (alreadyLiked) {
        await QuestionCommentLike.query().where({ commentId, userId }).delete();
      } else {
        await QuestionCommentLike.query().insert({ commentId, userId });
      }

      return { id: commentId };
    },
    deleteComment: async (root, { commentId }, ctx) => {
      const comment = await QuestionComment.query()
        .where({ id: commentId, userId: ctx.user.id })
        .delete();
      if (!comment) throw new Error('Comment not found');
      return 'Successfully deleted';
    },
    addComment: async (root, { data }, ctx) => {
      const { text, isPrivate, isAnonymous, questionId } = data;
      const comment = await QuestionComment.query().insertAndFetch({
        text,
        private: isPrivate ? 1 : 0,
        anonymous: isAnonymous ? 1 : 0,
        questionId,
        userId: ctx.user.id
      });

      if (!isPrivate) {
        // Notification for other users in thread
        const comments = await QuestionComment.query()
          .where({ questionId })
          .whereNot({ userId: ctx.user.id, private: 1 })
          .distinct('userId');
        for (let c of comments) {
          await Notification.query().insert({
            message: `Der er kommet en ny kommentar på et spørgsmål du har kommenteret på.    
            [Gå til spørgsmålet](${domain}/quiz/${questionId})`,
            userId: c.userId
          });
        }
      }

      return { id: comment.id };
    },
    editComment: async (root, { data }, ctx) => {
      const { id, text, isPrivate, isAnonymous, questionId } = data;
      const exists = await QuestionComment.query().findOne({ id, userId: ctx.user.id });
      if (exists) {
        const comment = await exists.$query().updateAndFetch({
          text,
          private: isPrivate ? 1 : 0,
          anonymous: isAnonymous ? 1 : 0,
          questionId
        });

        return { id: comment.id };
      }
      throw new Error('Comment not found');
    }
  },

  Comment: {
    id: ({ id }) => id,
    text: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      return comment.text;
    },
    isPrivate: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      return !!comment.private;
    },
    isAnonymous: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      return !!comment.anonymous;
    },
    user: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      if (comment.anonymous && comment.userId !== ctx.user?.id) return { id: 924 };
      return { id: comment.userId };
    },
    createdAt: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      return comment.createdAt.toISOString();
    },
    updatedAt: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      return comment.updatedAt.toISOString();
    },
    likes: async ({ id }) => {
      const likes = await QuestionCommentLike.query().where({ commentId: id });
      return likes.map((like) => ({ commentId: like.commentId, userId: like.userId }));
    },
    question: async ({ id }, _, ctx) => {
      const comment = await ctx.commentsLoader.load(id);
      return { id: comment.questionId };
    }
  }
};
