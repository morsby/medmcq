import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import ExamSet from 'models/exam_set';

export const typeDefs = gql`
  extend type Query {
    examSets: [ExamSet]
  }

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
  Query: {
    examSets: async () => {
      const examSets = await ExamSet.query().select('id');
      return examSets.map((examSet) => ({ id: examSet.id }));
    }
  },

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
