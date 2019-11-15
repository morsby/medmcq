import { gql } from 'apollo-server-express';

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
  Answer: {}
};
