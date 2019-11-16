import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import Semester from 'models/semester';
import ExamSet from 'models/exam_set';
import Specialty from 'models/specialty';
import Tag from 'models/tag';

export const typeDefs = gql`
  extend type Query {
    semesters: [Semester]
  }

  type Semester {
    id: Int
    value: Int
    name: String
    shortName: String
    examSets: [ExamSet]
    specialties: [Specialty]
    tags: [Tag]
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
    },
    examSets: async ({ id }, _, ctx: Context) => {
      const examSets = await ExamSet.query().where({ semesterId: id });
      return examSets.map((examSet) => ({ id: examSet.id }));
    },
    specialties: async ({ id }, _, ctx: Context) => {
      const specialties = await Specialty.query().where({ semesterId: id });
      return specialties.map((specialty) => ({ id: specialty.id }));
    },
    tags: async ({ id }, _, ctx: Context) => {
      const tags = await Tag.query().where({ semesterId: id });
      return tags.map((tag) => ({ id: tag.id }));
    }
  }
};
