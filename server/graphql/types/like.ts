import { gql } from 'apollo-server-express';
import { Resolvers } from 'types/resolvers-types';

export const typeDefs = gql`
  type Like {
    commentId: Int
    userId: Int
  }
`;

export const resolvers: Resolvers = {
  Like: {
    commentId: async ({ commentId, userId }, _, ctx) => {
      const like = await ctx.likesLoader.load([commentId, userId]);
      return like.commentId;
    },
    userId: async ({ commentId, userId }, _, ctx) => {
      const like = await ctx.likesLoader.load([commentId, userId]);
      return like.userId;
    }
  }
};
