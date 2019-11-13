import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type SpecialtyVote {
    id: Int
    questionId: Int
    userId: Int
    value: Int
  }
`;

export const resolvers = {
  SpecialtyVote: {
    id: ({ id }) => id,
    questionId: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.specialtyLoaders.specialtyVoteLoader.load(id);
      return specialtyVote.questionId;
    },
    userId: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.specialtyLoaders.specialtyVoteLoader.load(id);
      return specialtyVote.userId;
    },
    value: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.specialtyLoaders.specialtyVoteLoader.load(id);
      return specialtyVote.value;
    }
  }
};
