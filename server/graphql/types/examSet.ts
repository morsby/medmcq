import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type ExamSet {
    id: Int
    year: Int
    season: String
    semester: Semester
    createdAt: String
    updatedAt: String
  }
`;

export const resolvers = {
  ExamSet: {
    id: ({ id }) => id,
    year: async ({ id }, args, ctx: Context) => {
      const examSet = await ctx.examSetLoaders.examSetsLoader.load(id);
      return examSet.year;
    },
    season: async ({ id }, args, ctx: Context) => {
      const examSet = await ctx.examSetLoaders.examSetsLoader.load(id);
      return examSet.season;
    },
    semester: async ({ id }, args, ctx: Context) => {
      const examSet = await ctx.examSetLoaders.examSetsLoader.load(id);
      return { id: examSet.semesterId };
    }
  }
};
