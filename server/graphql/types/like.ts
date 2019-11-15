import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Like {
    commentId: Int
    userId: Int
  }
`;

export const resolvers = {
  Like: {}
};
