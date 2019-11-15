import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type Semester {
    id: Int
    value: Int
    name: String
    shortName: String
  }
`;

export const resolvers = {
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
