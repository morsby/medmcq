import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type Like {
    commentId: Int
    userId: Int
  }
`;

export const resolvers = {
  Like: {
    commentId: async ({ id }, _, ctx: Context) => {
      const like = await ctx.likeLoaders.likesLoader.load(id);
      return like.commentId;
    },
    userId: async ({ id }, _, ctx: Context) => {
      const like = await ctx.likeLoaders.likesLoader.load(id);
      return like.userId;
    }
  }
};
