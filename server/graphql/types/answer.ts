import { gql } from 'apollo-server-express';
import QuestionUserAnswer from 'models/question_user_answer';
import { Resolvers } from 'types/resolvers-types';

export const typeDefs = gql`
  type UserAnswer {
    id: Int
    answer: QuestionAnswer
    answerTime: Int
    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    answer(data: UserAnswerInput!): String
  }

  input UserAnswerInput {
    answerId: Int!
    answerTime: Int!
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    answer: async (root, { data }, ctx) => {
      const { answerId, answerTime } = data;
      const userId = ctx.user?.id;

      await QuestionUserAnswer.query().insert({
        userId,
        answerId,
        answerTime,
      });

      return 'Succesfully saved answer';
    },
  },

  UserAnswer: {
    id: ({ id }) => id,
    answer: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return { id: answer.answerId };
    },
    answerTime: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.answerTime;
    },
    createdAt: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.createdAt.toISOString();
    },
    updatedAt: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.updatedAt.toISOString();
    },
  },
};
