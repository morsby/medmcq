import { gql } from 'apollo-server-express';
import { merge } from 'lodash';
import { typeDefs as ShareLink, resolvers as shareLinkResolvers } from './types/shareLink';
import { typeDefs as Question, resolvers as questionResolvers } from 'graphql/types/question';
import { typeDefs as Specialty, resolvers as specialtyResolvers } from 'graphql/types/specialty';
import { typeDefs as ExamSet, resolvers as examSetResolvers } from 'graphql/types/examSet';

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [Query, ShareLink, Question, Specialty, ExamSet];
export const resolvers = merge(
  shareLinkResolvers,
  questionResolvers,
  specialtyResolvers,
  examSetResolvers
);
