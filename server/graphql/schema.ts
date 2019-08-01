import { gql, makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';
import { typeDefs as ShareLink, resolvers as ShareLinkResolvers } from './types/shareLink';
import { typeDefs as Question, resolvers as QuestionResolvers } from 'graphql/types/question';

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

export default makeExecutableSchema({
  typeDefs: [Query, ShareLink, Question],
  resolvers: merge(resolvers, ShareLinkResolvers, QuestionResolvers)
});
