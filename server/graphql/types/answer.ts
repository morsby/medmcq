import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type Answer {
    id: Int
    answer: Int
    questionId: Int
    createdAt: String
    updatedAt: String
  }
`;

export const resolvers = {
  Answer: {
    id: ({ id }) => id,
    answer: ({ id }, _, ctx: Context) => {},
    questionId: ({ id }, _, ctx: Context) => {},
    createdAt: ({ id }, _, ctx: Context) => {},
    updatedAt: ({ id }, _, ctx: Context) => {}
  }
};
