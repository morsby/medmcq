import { gql } from 'apollo-server-express';
import Question from 'models/question';
import QuestionUserAnswer from 'models/question_user_answer';
import { Resolvers } from 'types/resolvers-types';

export const typeDefs = gql`
  type Answer {
    id: Int
    answer: Int
    question: Question
    answerTime: Int
    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    answer(data: AnswerInput!): String
  }

  input AnswerInput {
    answer: Int!
    questionId: Int!
    answerTime: Int!
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    answer: async (root, { data }, ctx) => {
      const { answer, questionId, answerTime } = data;
      const userId = ctx.user?.id;

      await QuestionUserAnswer.query().insert({
        questionId,
        userId,
        answer,
        answerTime
      });

      return 'Succesfully saved answer';
    }
  },

  Answer: {
    id: ({ id }) => id,
    answer: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.answer;
    },
    answerTime: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.answerTime;
    },
    question: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      const question = await Question.query()
        .findById(answer.questionId)
        .select('id');
      return { id: question.id };
    },
    createdAt: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.createdAt.toISOString();
    },
    updatedAt: async ({ id }, _, ctx) => {
      const answer = await ctx.userAnswersLoader.load(id);
      return answer.updatedAt.toISOString();
    }
  }
};
