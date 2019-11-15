import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type TagVote {
    tagId: Int
    questionId: Int
    votes: Int
  }

  type SpecialtyVote {
    id: Int
    specialty: Specialty
    question: Question
    user: User
    value: Int
  }

  type Specialty {
    id: Int
    question: Question
    user: User
    value: Int
  }

  type Tag {
    id: Int
    question: Question
    user: User
    value: Int
  }
`;

export const resolvers = {
  TagVote: {},
  SpecialtyVote: {
    id: ({ id }) => id,
    specialty: ({ id }) => ({ id }),
    question: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return { id: specialtyVote.questionId };
    },
    user: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return { id: specialtyVote.userId };
    },
    value: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return specialtyVote.value;
    }
  }
};
