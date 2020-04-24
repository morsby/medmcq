import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from 'graphql/types';
import jsonWebToken from 'jsonwebtoken';
import Express from 'express';
import { createCommentsLoader } from '../graphql/dataloaders/commentLoaders';
import {
  createUserAnswersLoader,
  createUserAnswersByQuestionIdLoader,
} from '../graphql/dataloaders/answerLoaders';
import { createExamSetsLoader } from '../graphql/dataloaders/examSetLoaders';
import { createLikesLoader } from '../graphql/dataloaders/likeLoaders';
import {
  createSpecialtyLoader,
  createSpecialtyVoteLoader,
  createTagLoader,
  createTagVotesLoader,
} from '../graphql/dataloaders/metadataLoaders';
import { createQuestionLoader } from '../graphql/dataloaders/questionLoaders';
import { createSemesterLoader } from '../graphql/dataloaders/semesterLoaders';
import { createUserLoader, createBookmarkLoader } from '../graphql/dataloaders/userLoaders';
const secret = process.env.SECRET || '';
const isDev = process.env.NODE_ENV === 'production' ? false : true;

const decodeUser = (jwt: string, res: Express.Response) => {
  if (!jwt) return null;
  try {
    return jsonWebToken.verify(jwt, secret);
  } catch (error) {
    res.cookie('user', {}, { expires: new Date(0) });
    return null;
  }
};

const generateContext = (req: Express.Request, res: Express.Response) => ({
  userAnswersLoader: createUserAnswersLoader(),
  userAnswersByQuestionIdLoader: createUserAnswersByQuestionIdLoader(),
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
  user: decodeUser(req.cookies.user, res) as { id: number } | null,
  res,
  req,
});

export type Context = ReturnType<typeof generateContext>;

export default new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req, res }) => generateContext(req, res),
  playground: isDev,
  tracing: isDev,
});
