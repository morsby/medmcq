import { gql, makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';
import { typeDefs as ShareLink, resolvers as ShareLinkResolvers } from './types/shareLink';
import { typeDefs as Question, resolvers as QuestionResolvers } from './types/question';
import {
  typeDefs as CorrectAnswer,
  resolvers as CorrectAnswerResolvers
} from './types/question_correct_answers';

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
  typeDefs: [Query, ShareLink, Question, CorrectAnswer],
  resolvers: merge(resolvers, ShareLinkResolvers, QuestionResolvers, CorrectAnswerResolvers)
});
