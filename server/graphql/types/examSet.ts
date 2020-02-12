import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import ExamSet from 'models/exam_set';
import Question from 'models/question';
import QuestionCorrectAnswer from 'models/question_correct_answer';
import QuestionImage from 'models/question_image';

export const typeDefs = gql`
  extend type Query {
    examSets: [ExamSet]
  }

  extend type Mutation {
    createExamSet(data: [ExamSetInput!]!): ExamSet
  }

  type ExamSet {
    id: Int
    year: Int
    season: String
    semester: Semester
    createdAt: String
    updatedAt: String
  }

  input ExamSetInput {
    year: Int!
    season: String!
    semesterId: Int!
    questions: [QuestionInput]
  }
`;

export const resolvers = {
  Query: {
    examSets: async () => {
      const examSets = await ExamSet.query().select('id');
      return examSets.map((examSet) => ({ id: examSet.id }));
    }
  },

  Mutation: {
    createExamSet: async (root, { data }, ctx: Context) => {
      if (ctx.user.roleId < 2) throw new Error('Not permitted');

      const { year, season, semesterId, questions } = data;
      const examSet = await ExamSet.query().insertAndFetch({
        year,
        season,
        semesterId
      });

      for (let question of questions) {
        const { answer1, answer2, answer3, correctAnswers, text, images, examSetQno } = question;

        const newQuestion = await Question.query().insertAndFetch({
          text,
          answer1,
          answer2,
          answer3,
          examSetQno,
          examSetId: examSet.id
        });
        for (let correctAnswer of correctAnswers) {
          await QuestionCorrectAnswer.query().insert({
            answer: correctAnswer,
            questionId: newQuestion.id
          });
        }
        for (let image of images) {
          await QuestionImage.query().insert({
            link: image.link,
            questionId: newQuestion.id
          });
        }
      }

      return { id: examSet.id };
    }
  },

  ExamSet: {
    id: ({ id }) => id,
    year: async ({ id }, args, ctx: Context) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return examSet.year;
    },
    season: async ({ id }, args, ctx: Context) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return examSet.season;
    },
    semester: async ({ id }, args, ctx: Context) => {
      const examSet = await ctx.examSetsLoader.load(id);
      return { id: examSet.semesterId };
    }
  }
};
