import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from 'graphql/types';
import Express from 'express';
import { createCommentsLoader } from '../graphql/dataloaders/commentLoaders';
import { createUserAnswersLoader } from '../graphql/dataloaders/answerLoaders';
import { createExamSetsLoader } from '../graphql/dataloaders/examSetLoaders';
import { createLikesLoader } from '../graphql/dataloaders/likeLoaders';
import {
  createSpecialtyLoader,
  createSpecialtyVoteLoader,
  createTagLoader,
  createTagVotesLoader
} from '../graphql/dataloaders/metadataLoaders';
import {
  createQuestionLoader,
  createQuestionAnswersLoader,
  createQuestionAnswersByQuestionLoader
} from '../graphql/dataloaders/questionLoaders';
import { createSemesterLoader } from '../graphql/dataloaders/semesterLoaders';
import {
  createUserLoader,
  createBookmarkLoader,
  createNotificationLoader
} from '../graphql/dataloaders/userLoaders';
import User from 'models/user';
const isDev = process.env.NODE_ENV === 'production' ? false : true;

const generateContext = (req: Express.Request & {user: User}, res: Express.Response) => ({
  userAnswersLoader: createUserAnswersLoader(),
  examSetsLoader: createExamSetsLoader(),
  likesLoader: createLikesLoader(),
  specialtyLoader: createSpecialtyLoader(),
  specialtyVoteLoader: createSpecialtyVoteLoader(),
  tagLoader: createTagLoader(),
  tagVotesLoader: createTagVotesLoader(),
  questionLoader: createQuestionLoader(),
  semesterLoader: createSemesterLoader(),
  userLoader: createUserLoader(),
  bookmarkLoader: createBookmarkLoader(),
  commentsLoader: createCommentsLoader(),
  questionAnswersLoader: createQuestionAnswersLoader(),
  questionAnswersByQuestionLoader: createQuestionAnswersByQuestionLoader(),
  notificationLoader: createNotificationLoader(),
  user: req.user,
  res,
  req
});

export type Context = ReturnType<typeof generateContext>;

export default new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req, res }) => generateContext(req as any, res),
  playground: isDev,
  tracing: isDev
});
