import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type TagVote {
    id: Int
    tag: Tag
    question: Question
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
    name: String
    semester: Semester
    createdAt: String
    updatedAt: String
    oldId: String
  }

  type Tag {
    id: Int
    question: Question
    user: User
    value: Int
  }
`;

export const resolvers = {
  TagVote: {
    id: ({ id }) => id,
    tag: () => {},
    question: () => {},
    votes: () => {}
  },
  SpecialtyVote: {
    id: ({ id }) => id,
    specialty: async ({ id }, _, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return { id: specialtyVote.specialtyId };
    },
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
  },
  Tag: {},
  Specialty: {
    id: ({ id }) => id,
    name: async ({ id }, _, ctx: Context) => {
      const specialty = await ctx.metadataLoaders.specialtyLoader.load(id);
      return specialty.name;
    }
  }
};
