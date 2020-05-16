import { gql } from 'apollo-server-express';
import Semester from 'models/semester';
import ExamSet from 'models/exam_set';
import Specialty from 'models/specialty';
import Tag from 'models/tag';
import Question from 'models/question';
import User from 'models/user';
import { Resolvers } from 'types/resolvers-types';

export const typeDefs = gql`
  extend type Query {
    semesters: [Semester]
    semester(id: Int!): Semester
  }

  type Semester {
    id: Int
    value: Int
    name: String
    shortName: String
    examSets: [ExamSet]
    specialties: [Specialty]
    tags: [Tag]
    questionCount: Int
  }
`;

export const resolvers: Resolvers = {
  Query: {
    semesters: async (root, args, ctx) => {
      const user = await User.query().findById(ctx.user?.id).skipUndefined();
      let semesters: Semester[];
      if (user?.roleId < 4) {
        semesters = await Semester.query();
      } else {
        semesters = await Semester.query().where({ locked: 0 });
      }
      return semesters.map((semester) => ({ id: semester.id }));
    },
    semester: async (root, { id }) => {
      const semester = await Semester.query().findById(id);
      return semester;
    }
  },

  Semester: {
    id: ({ id }) => id,
    value: async ({ id }, _, ctx) => {
      const semester = await ctx.semesterLoader.load(id);
      return semester.value;
    },
    name: async ({ id }, _, ctx) => {
      const semester = await ctx.semesterLoader.load(id);
      return semester.name;
    },
    shortName: async ({ id }, _, ctx) => {
      const semester = await ctx.semesterLoader.load(id);
      return semester.shortName;
    },
    questionCount: async ({ id }) => {
      const examSetIds = ExamSet.query().where({ semesterId: id }).select('id');
      const count: any = await Question.query().whereIn('examSetId', examSetIds).count();
      return count[0]['count(*)']; // Wierd way to get count from Objection/Knex
    },
    examSets: async ({ id }) => {
      const examSets = await ExamSet.query().where({ semesterId: id });
      return examSets.map((examSet) => ({ id: examSet.id }));
    },
    specialties: async ({ id }) => {
      const specialties = await Specialty.query().where({ semesterId: id });
      return specialties.map((specialty) => ({ id: specialty.id }));
    },
    tags: async ({ id }) => {
      const tags = await Tag.query().where({ semesterId: id });
      return tags.map((tag) => ({ id: tag.id }));
    }
  }
};
