import { gql } from 'apollo-server-express';
import { typeDefs as ShareLink, resolvers as shareLinkResolvers } from './shareLink';
import { typeDefs as Question, resolvers as questionResolvers } from './question';
import { typeDefs as Metadata, resolvers as metadataResolvers } from './metadata';
import { typeDefs as ExamSet, resolvers as examSetResolvers } from './examSet';
import { typeDefs as Semester, resolvers as semesterResolvers } from './semester';
import { typeDefs as Comment, resolvers as commentResolvers } from './comment';
import { typeDefs as Answer, resolvers as answerResolvers } from './answer';
import { typeDefs as Vote, resolvers as voteResolvers } from './metadata';
import { typeDefs as User, resolvers as userResolvers } from './user';
import { typeDefs as Like, resolvers as likeResolvers } from './like';
import { typeDefs as Other, resolvers as otherResolvers } from './other.types';
import { notificationTypeDefs, notificationResolvers } from './notification.types';

const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  Query,
  ShareLink,
  Question,
  Metadata,
  ExamSet,
  Semester,
  Comment,
  Answer,
  Vote,
  User,
  Like,
  Other,
  notificationTypeDefs
];

export const resolvers = [
  shareLinkResolvers,
  questionResolvers,
  metadataResolvers,
  examSetResolvers,
  semesterResolvers,
  commentResolvers,
  answerResolvers,
  voteResolvers,
  userResolvers,
  likeResolvers,
  otherResolvers,
  notificationResolvers
];
