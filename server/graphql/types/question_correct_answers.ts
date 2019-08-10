import { gql } from 'apollo-server-express';
import QuestionCorrectAnswer from '../../models/question_correct_answer';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  type CorrectAnswer {
    id: Int
    answer: Int
    questionId: Int
  }

  input CorrectAnswerFilter {
    q: String
    id: ID
    title: String
    views: Int
    views_lt: Int
    views_lte: Int
    views_gt: Int
    views_gte: Int
    user_id: ID
  }

  extend type Query {
    CorrectAnswer(id: Int, questionId: Int): CorrectAnswer

    allCorrectAnswers(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: CorrectAnswerFilter
    ): [CorrectAnswer]

    _allCorrectAnswersMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: CorrectAnswerFilter
    ): ListMetadata
  }

  extend type Mutation {
    createCorrectAnswer(title: String!, views: Int!, user_id: ID!): CorrectAnswer
    updateCorrectAnswer(id: ID!, title: String!, views: Int!, user_id: ID!): CorrectAnswer
    deleteCorrectAnswer(id: ID!): CorrectAnswer
  }
`;

export const resolvers = {
  Query: {
    allCorrectAnswers: async () => {
      return await QuestionCorrectAnswer.query().select('id');
    },

    CorrectAnswer: (_root, { id }) => ({ id })
  },

  CorrectAnswer: {
    answer: async (parent, _args, ctxt) => {
      console.log(parent, _args);
      const { answer } = await ctxt.dataloaders.correctAnswers.byIds.load(parent.id);
      return answer;
    }
  },

  Mutation: {
    createCorrectAnswer: async () => {
      return 'done';
    }
  }
};
