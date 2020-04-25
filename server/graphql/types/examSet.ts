import { gql } from 'apollo-server-express';
import ExamSet from 'models/exam_set';
import Question from 'models/question';
import QuestionImage from 'models/question_image';
import { Resolvers } from 'types/resolvers-types';
import User from 'models/user';

export const typeDefs = gql`
  extend type Query {
    examSets: [ExamSet]
  }

  extend type Mutation {
    createExamSet(data: ExamSetInput): ExamSet
  }

  type ExamSet {
    id: Int
    year: Int
    season: String
    semester: Semester
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
`;

export const resolvers: Resolvers = {
  Query: {
    examSets: async () => {
      const examSets = await ExamSet.query().select('id');
      return examSets.map((examSet) => ({ id: examSet.id }));
    },
  },

  Mutation: {
    createExamSet: async (root, { data }, ctx) => {
      if (!ctx.user) throw new Error('Not permitted');
      const user = await User.query().findById(ctx.user.id);
      if (user.roleId >= 4) throw new Error('Not permitted');

      const { year, season, semesterId, questions } = data;
      const examSet = await ExamSet.query().insertAndFetch({
        year,
        season,
        semesterId,
      });

      let examSetQno = 1;
      for (let question of questions) {
        const { text, images } = question;

        const newQuestion = await Question.query().insertAndFetch({
          text,
          examSetQno,
          examSetId: examSet.id,
        });
        examSetQno++;

        for (let image of images) {
          await QuestionImage.query().insert({
            link: image,
            questionId: newQuestion.id,
          });
        }
      }

      return { id: examSet.id };
    },
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
    questionCount: async ({ id }) => {
      const result = await Question.query().where({ examSetId: id }).count().first();
      return result['count(*)'];
    },
  },
};
