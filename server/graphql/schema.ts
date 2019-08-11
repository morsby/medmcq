import { gql, makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';
import { typeDefs as ShareLink, resolvers as ShareLinkResolvers } from './types/shareLink';
import { typeDefs as Question, resolvers as QuestionResolvers } from './types/question';
import { typeDefs as Semester, resolvers as SemesterResolvers } from './types/semester';
import { typeDefs as ExamSet, resolvers as ExamSetResolvers } from './types/exam_set';
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
  typeDefs: [Query, ShareLink, Semester, ExamSet, Question, CorrectAnswer],
  resolvers: merge(
    resolvers,
    ShareLinkResolvers,
    SemesterResolvers,
    ExamSetResolvers,
    QuestionResolvers,
    CorrectAnswerResolvers
  )
});
