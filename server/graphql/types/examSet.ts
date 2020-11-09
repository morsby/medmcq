import { gql } from 'apollo-server-express';
import ExamSet from 'models/exam_set';
import Question from 'models/question';
import { Resolvers } from 'types/resolvers-types';

export const typeDefs = gql`
  extend type Query {
    examSets: [ExamSet]
  }

  type ExamSet {
    id: Int
    year: Int
    season: String
    semester: Semester
    reexam: Boolean
    createdAt: String
    updatedAt: String
    questionCount: Int
  }

  input ExamSetInput {
    year: Int!
    season: String!
    semesterId: Int!
    questions: [QuestionInput]
  }

  scalar Any
`;

export const resolvers: Resolvers = {
  Query: {
    examSets: async () => {
      const examSets = await ExamSet.query().select('id');
      return examSets.map((examSet) => ({ id: examSet.id }));
    }
  },

  ExamSet: {
    id: ({ id }) => id,
    year: async ({ id }, args, ctx) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return examSet.year;
    },
    season: async ({ id }, args, ctx) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return examSet.season;
    },
    semester: async ({ id }, args, ctx) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return { id: examSet.semesterId };
    },
    reexam: async ({ id }, args, ctx) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return !!examSet.reexam;
    },
    questionCount: async ({ id }) => {
      const result: any = await Question.query().where({ examSetId: id }).count().first();
      return result['count(*)'];
    }
  }
};
