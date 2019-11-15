import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import Question from 'models/question';

export const typeDefs = gql`
  type Answer {
    id: Int
    answer: Int
    question: Question
    answerTime: Int
    createdAt: String
    updatedAt: String
  }
`;

export const resolvers = {
  Answer: {
    id: ({ id }) => id,
    answer: async ({ id }, _, ctx: Context) => {
      const answer = await ctx.answerLoaders.userAnswersLoader.load(id);
      return answer.answer;
    },
    answerTime: async ({ id }, _, ctx: Context) => {
      const answer = await ctx.answerLoaders.userAnswersLoader.load(id);
      return answer.answerTime;
    },
    question: async ({ id }, _, ctx: Context) => {
      const answer = await ctx.answerLoaders.userAnswersLoader.load(id);
      const question = await Question.query()
        .findById(answer.questionId)
        .select('id');
      return { id: question.id };
    },
    createdAt: async ({ id }, _, ctx: Context) => {
      const answer = await ctx.answerLoaders.userAnswersLoader.load(id);
      return answer.createdAt;
    },
    updatedAt: async ({ id }, _, ctx: Context) => {
      const answer = await ctx.answerLoaders.userAnswersLoader.load(id);
      return answer.updatedAt;
    }
  }
};
