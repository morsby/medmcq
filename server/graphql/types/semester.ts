import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import Semester from 'models/semester';

export const typeDefs = gql`
  extend type Query {
    semesters: [Semester]
  }

  type Semester {
    id: Int
    value: Int
    name: String
    shortName: String
  }
`;

export const resolvers = {
  Query: {
    semesters: async () => {
      const semesters = await Semester.query();
      return semesters.map((semester) => ({ id: semester.id }));
    }
  },

  Semester: {
    id: ({ id }) => id,
    value: async ({ id }, _, ctx: Context) => {
      const semester = await ctx.semesterLoaders.semesterLoader.load(id);
      return semester.value;
    },
    name: async ({ id }, _, ctx: Context) => {
      const semester = await ctx.semesterLoaders.semesterLoader.load(id);
      return semester.name;
    },
    shortName: async ({ id }, _, ctx: Context) => {
      const semester = await ctx.semesterLoaders.semesterLoader.load(id);
      return semester.shortName;
    }
  }
};
