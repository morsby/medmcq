import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from 'config/apolloServer';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
   __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  shareLink?: Maybe<Array<Maybe<Question>>>;
  questions?: Maybe<Array<Question>>;
  examSets?: Maybe<Array<Maybe<ExamSet>>>;
  semesters?: Maybe<Array<Maybe<Semester>>>;
  semester?: Maybe<Semester>;
  user?: Maybe<User>;
  checkUsernameAvailability?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<User>;
  maintenance?: Maybe<Maintenance>;
  notice?: Maybe<Notice>;
};


export type QueryShareLinkArgs = {
  shareId?: Maybe<Scalars['Int']>;
};


export type QueryQuestionsArgs = {
  filter: QuestionFilterInput;
};


export type QuerySemesterArgs = {
  id: Scalars['Int'];
};


export type QueryCheckUsernameAvailabilityArgs = {
  data?: Maybe<UserAvailableInput>;
};

export type Mutation = {
   __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  createShareLink?: Maybe<Scalars['String']>;
  reportQuestion?: Maybe<Scalars['String']>;
  createQuestion?: Maybe<Question>;
  updateQuestion?: Maybe<Question>;
  voteTag?: Maybe<Question>;
  voteSpecialty?: Maybe<Question>;
  suggestTag?: Maybe<Scalars['String']>;
  createExamSet?: Maybe<ExamSet>;
  addComment?: Maybe<Comment>;
  editComment?: Maybe<Comment>;
  likeComment?: Maybe<Comment>;
  deleteComment?: Maybe<Scalars['String']>;
  answer?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  signup?: Maybe<Scalars['String']>;
  logout?: Maybe<Scalars['String']>;
  editUser?: Maybe<Scalars['String']>;
  forgotPassword?: Maybe<Scalars['String']>;
  resetPassword?: Maybe<Scalars['String']>;
  manualCompleteSet?: Maybe<Scalars['String']>;
  bookmark?: Maybe<Bookmark>;
  contact?: Maybe<Scalars['String']>;
};


export type MutationCreateShareLinkArgs = {
  questionIds: Array<Scalars['Int']>;
};


export type MutationReportQuestionArgs = {
  report: Scalars['String'];
  questionId: Scalars['Int'];
};


export type MutationCreateQuestionArgs = {
  data?: Maybe<QuestionInput>;
};


export type MutationUpdateQuestionArgs = {
  data?: Maybe<QuestionInput>;
};


export type MutationVoteTagArgs = {
  data?: Maybe<VoteInput>;
};


export type MutationVoteSpecialtyArgs = {
  data?: Maybe<VoteInput>;
};


export type MutationSuggestTagArgs = {
  tagName: Scalars['String'];
  questionId: Scalars['Int'];
};


export type MutationCreateExamSetArgs = {
  data?: Maybe<ExamSetInput>;
};


export type MutationAddCommentArgs = {
  data?: Maybe<CommentInput>;
};


export type MutationEditCommentArgs = {
  data?: Maybe<CommentInput>;
};


export type MutationLikeCommentArgs = {
  commentId: Scalars['Int'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['Int'];
};


export type MutationAnswerArgs = {
  data: UserAnswerInput;
};


export type MutationLoginArgs = {
  data?: Maybe<LoginInput>;
};


export type MutationSignupArgs = {
  data?: Maybe<UserInput>;
};


export type MutationEditUserArgs = {
  data?: Maybe<UserEditInput>;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
};


export type MutationManualCompleteSetArgs = {
  examSetId: Scalars['Int'];
};


export type MutationBookmarkArgs = {
  questionId: Scalars['Int'];
};


export type MutationContactArgs = {
  data?: Maybe<ContactInput>;
};

export type QuestionFilterInput = {
  specialtyIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  tagIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  semesterId?: Maybe<Scalars['Int']>;
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  n?: Maybe<Scalars['Int']>;
  examSetId?: Maybe<Scalars['Int']>;
  onlyNew?: Maybe<Scalars['Boolean']>;
  onlyWrong?: Maybe<Scalars['Boolean']>;
  commentIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  search?: Maybe<Scalars['String']>;
  shareId?: Maybe<Scalars['String']>;
};

export type Question = {
   __typename?: 'Question';
  id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
  answers?: Maybe<Array<Maybe<QuestionAnswer>>>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  oldId?: Maybe<Scalars['String']>;
  examSetQno?: Maybe<Scalars['Int']>;
  publicComments?: Maybe<Array<Maybe<Comment>>>;
  privateComments?: Maybe<Array<Maybe<Comment>>>;
  specialtyVotes?: Maybe<Array<Maybe<SpecialtyVote>>>;
  tagVotes?: Maybe<Array<Maybe<TagVote>>>;
  specialties?: Maybe<Array<Maybe<Specialty>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  examSet?: Maybe<ExamSet>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type QuestionAnswer = {
   __typename?: 'QuestionAnswer';
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  isCorrect?: Maybe<Scalars['Boolean']>;
  text?: Maybe<Scalars['String']>;
  correctPercent?: Maybe<Scalars['Int']>;
  question?: Maybe<Question>;
};

export type QuestionInput = {
  id?: Maybe<Scalars['Int']>;
  answers?: Maybe<Array<Maybe<QuestionAnswerInput>>>;
  text: Scalars['String'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  examSetId: Scalars['Int'];
};

export type QuestionAnswerInput = {
  text?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  isCorrect?: Maybe<Scalars['Boolean']>;
};

export type Specialty = {
   __typename?: 'Specialty';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  semester?: Maybe<Semester>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  oldId?: Maybe<Scalars['String']>;
  questionCount?: Maybe<Scalars['Int']>;
};

export type Tag = {
   __typename?: 'Tag';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  semester?: Maybe<Semester>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  oldId?: Maybe<Scalars['String']>;
  parent?: Maybe<Tag>;
  questionCount?: Maybe<Scalars['Int']>;
};

export type TagVote = {
   __typename?: 'TagVote';
  id?: Maybe<Scalars['Int']>;
  tag?: Maybe<Tag>;
  question?: Maybe<Question>;
  user?: Maybe<User>;
  vote?: Maybe<Scalars['Int']>;
};

export type SpecialtyVote = {
   __typename?: 'SpecialtyVote';
  id?: Maybe<Scalars['Int']>;
  specialty?: Maybe<Specialty>;
  question?: Maybe<Question>;
  user?: Maybe<User>;
  vote?: Maybe<Scalars['Int']>;
};

export type VoteInput = {
  questionId: Scalars['Int'];
  metadataId: Scalars['Int'];
  vote?: Maybe<Scalars['Int']>;
};

export type ExamSet = {
   __typename?: 'ExamSet';
  id?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
  season?: Maybe<Scalars['String']>;
  semester?: Maybe<Semester>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  questionCount?: Maybe<Scalars['Int']>;
};

export type ExamSetInput = {
  year: Scalars['Int'];
  season: Scalars['String'];
  semesterId: Scalars['Int'];
  questions?: Maybe<Array<Maybe<QuestionInput>>>;
};

export type Semester = {
   __typename?: 'Semester';
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  shortName?: Maybe<Scalars['String']>;
  examSets?: Maybe<Array<Maybe<ExamSet>>>;
  specialties?: Maybe<Array<Maybe<Specialty>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  questionCount?: Maybe<Scalars['Int']>;
};

export type Comment = {
   __typename?: 'Comment';
  id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  isAnonymous?: Maybe<Scalars['Boolean']>;
  user?: Maybe<User>;
  likes?: Maybe<Array<Maybe<Like>>>;
  question?: Maybe<Question>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type CommentInput = {
  id?: Maybe<Scalars['Int']>;
  text: Scalars['String'];
  isPrivate?: Maybe<Scalars['Boolean']>;
  isAnonymous?: Maybe<Scalars['Boolean']>;
  questionId?: Maybe<Scalars['Int']>;
};

export type UserAnswer = {
   __typename?: 'UserAnswer';
  id?: Maybe<Scalars['Int']>;
  answer?: Maybe<QuestionAnswer>;
  answerTime?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type UserAnswerInput = {
  answerId: Scalars['Int'];
  answerTime: Scalars['Int'];
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email?: Maybe<Scalars['String']>;
};

export type UserAvailableInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type UserEditInput = {
  password?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type User = {
   __typename?: 'User';
  id?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  bookmarks?: Maybe<Array<Maybe<Bookmark>>>;
  answers?: Maybe<Array<Maybe<UserAnswer>>>;
  specialtyVotes?: Maybe<Array<Maybe<SpecialtyVote>>>;
  tagVotes?: Maybe<Array<Maybe<TagVote>>>;
  likes?: Maybe<Array<Maybe<Like>>>;
  liked?: Maybe<Array<Maybe<Like>>>;
  manualCompletedSets?: Maybe<Array<Maybe<ManualCompletedSet>>>;
  publicComments?: Maybe<Array<Maybe<Comment>>>;
  privateComments?: Maybe<Array<Maybe<Comment>>>;
  answeredSets?: Maybe<Array<Maybe<AnsweredSet>>>;
};


export type UserBookmarksArgs = {
  semester?: Maybe<Scalars['Int']>;
};


export type UserAnswersArgs = {
  semester?: Maybe<Scalars['Int']>;
};


export type UserPublicCommentsArgs = {
  semester?: Maybe<Scalars['Int']>;
};


export type UserPrivateCommentsArgs = {
  semester?: Maybe<Scalars['Int']>;
};

export type AnsweredSet = {
   __typename?: 'AnsweredSet';
  examSetId?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};

export type Role = {
   __typename?: 'Role';
  id?: Maybe<Scalars['Int']>;
};

export type Bookmark = {
   __typename?: 'Bookmark';
  id?: Maybe<Scalars['Int']>;
  question?: Maybe<Question>;
  user?: Maybe<User>;
};

export type Profile = {
   __typename?: 'Profile';
  id?: Maybe<Scalars['Int']>;
};

export type ManualCompletedSet = {
   __typename?: 'ManualCompletedSet';
  examSetId?: Maybe<Scalars['Int']>;
};

export type Like = {
   __typename?: 'Like';
  commentId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
};

export type Maintenance = {
   __typename?: 'Maintenance';
  message?: Maybe<Scalars['String']>;
};

export type Notice = {
   __typename?: 'Notice';
  message?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type ContactInput = {
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  String: ResolverTypeWrapper<Partial<Scalars['String']>>,
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>,
  Query: ResolverTypeWrapper<{}>,
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>,
  Mutation: ResolverTypeWrapper<{}>,
  QuestionFilterInput: ResolverTypeWrapper<Partial<QuestionFilterInput>>,
  Question: ResolverTypeWrapper<Partial<Question>>,
  QuestionAnswer: ResolverTypeWrapper<Partial<QuestionAnswer>>,
  QuestionInput: ResolverTypeWrapper<Partial<QuestionInput>>,
  QuestionAnswerInput: ResolverTypeWrapper<Partial<QuestionAnswerInput>>,
  Specialty: ResolverTypeWrapper<Partial<Specialty>>,
  Tag: ResolverTypeWrapper<Partial<Tag>>,
  TagVote: ResolverTypeWrapper<Partial<TagVote>>,
  SpecialtyVote: ResolverTypeWrapper<Partial<SpecialtyVote>>,
  VoteInput: ResolverTypeWrapper<Partial<VoteInput>>,
  ExamSet: ResolverTypeWrapper<Partial<ExamSet>>,
  ExamSetInput: ResolverTypeWrapper<Partial<ExamSetInput>>,
  Semester: ResolverTypeWrapper<Partial<Semester>>,
  Comment: ResolverTypeWrapper<Partial<Comment>>,
  CommentInput: ResolverTypeWrapper<Partial<CommentInput>>,
  UserAnswer: ResolverTypeWrapper<Partial<UserAnswer>>,
  UserAnswerInput: ResolverTypeWrapper<Partial<UserAnswerInput>>,
  LoginInput: ResolverTypeWrapper<Partial<LoginInput>>,
  UserInput: ResolverTypeWrapper<Partial<UserInput>>,
  UserAvailableInput: ResolverTypeWrapper<Partial<UserAvailableInput>>,
  UserEditInput: ResolverTypeWrapper<Partial<UserEditInput>>,
  User: ResolverTypeWrapper<Partial<User>>,
  AnsweredSet: ResolverTypeWrapper<Partial<AnsweredSet>>,
  Role: ResolverTypeWrapper<Partial<Role>>,
  Bookmark: ResolverTypeWrapper<Partial<Bookmark>>,
  Profile: ResolverTypeWrapper<Partial<Profile>>,
  ManualCompletedSet: ResolverTypeWrapper<Partial<ManualCompletedSet>>,
  Like: ResolverTypeWrapper<Partial<Like>>,
  Maintenance: ResolverTypeWrapper<Partial<Maintenance>>,
  Notice: ResolverTypeWrapper<Partial<Notice>>,
  ContactInput: ResolverTypeWrapper<Partial<ContactInput>>,
  CacheControlScope: ResolverTypeWrapper<Partial<CacheControlScope>>,
  Upload: ResolverTypeWrapper<Partial<Scalars['Upload']>>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  String: Partial<Scalars['String']>,
  Boolean: Partial<Scalars['Boolean']>,
  Query: {},
  Int: Partial<Scalars['Int']>,
  Mutation: {},
  QuestionFilterInput: Partial<QuestionFilterInput>,
  Question: Partial<Question>,
  QuestionAnswer: Partial<QuestionAnswer>,
  QuestionInput: Partial<QuestionInput>,
  QuestionAnswerInput: Partial<QuestionAnswerInput>,
  Specialty: Partial<Specialty>,
  Tag: Partial<Tag>,
  TagVote: Partial<TagVote>,
  SpecialtyVote: Partial<SpecialtyVote>,
  VoteInput: Partial<VoteInput>,
  ExamSet: Partial<ExamSet>,
  ExamSetInput: Partial<ExamSetInput>,
  Semester: Partial<Semester>,
  Comment: Partial<Comment>,
  CommentInput: Partial<CommentInput>,
  UserAnswer: Partial<UserAnswer>,
  UserAnswerInput: Partial<UserAnswerInput>,
  LoginInput: Partial<LoginInput>,
  UserInput: Partial<UserInput>,
  UserAvailableInput: Partial<UserAvailableInput>,
  UserEditInput: Partial<UserEditInput>,
  User: Partial<User>,
  AnsweredSet: Partial<AnsweredSet>,
  Role: Partial<Role>,
  Bookmark: Partial<Bookmark>,
  Profile: Partial<Profile>,
  ManualCompletedSet: Partial<ManualCompletedSet>,
  Like: Partial<Like>,
  Maintenance: Partial<Maintenance>,
  Notice: Partial<Notice>,
  ContactInput: Partial<ContactInput>,
  CacheControlScope: Partial<CacheControlScope>,
  Upload: Partial<Scalars['Upload']>,
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  shareLink?: Resolver<Maybe<Array<Maybe<ResolversTypes['Question']>>>, ParentType, ContextType, RequireFields<QueryShareLinkArgs, never>>,
  questions?: Resolver<Maybe<Array<ResolversTypes['Question']>>, ParentType, ContextType, RequireFields<QueryQuestionsArgs, 'filter'>>,
  examSets?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExamSet']>>>, ParentType, ContextType>,
  semesters?: Resolver<Maybe<Array<Maybe<ResolversTypes['Semester']>>>, ParentType, ContextType>,
  semester?: Resolver<Maybe<ResolversTypes['Semester']>, ParentType, ContextType, RequireFields<QuerySemesterArgs, 'id'>>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  checkUsernameAvailability?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<QueryCheckUsernameAvailabilityArgs, never>>,
  profile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  maintenance?: Resolver<Maybe<ResolversTypes['Maintenance']>, ParentType, ContextType>,
  notice?: Resolver<Maybe<ResolversTypes['Notice']>, ParentType, ContextType>,
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  createShareLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationCreateShareLinkArgs, 'questionIds'>>,
  reportQuestion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationReportQuestionArgs, 'report' | 'questionId'>>,
  createQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationCreateQuestionArgs, never>>,
  updateQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionArgs, never>>,
  voteTag?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationVoteTagArgs, never>>,
  voteSpecialty?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationVoteSpecialtyArgs, never>>,
  suggestTag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSuggestTagArgs, 'tagName' | 'questionId'>>,
  createExamSet?: Resolver<Maybe<ResolversTypes['ExamSet']>, ParentType, ContextType, RequireFields<MutationCreateExamSetArgs, never>>,
  addComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<MutationAddCommentArgs, never>>,
  editComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<MutationEditCommentArgs, never>>,
  likeComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<MutationLikeCommentArgs, 'commentId'>>,
  deleteComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'commentId'>>,
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAnswerArgs, 'data'>>,
  login?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationLoginArgs, never>>,
  signup?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSignupArgs, never>>,
  logout?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  editUser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationEditUserArgs, never>>,
  forgotPassword?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>,
  resetPassword?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'token' | 'password'>>,
  manualCompleteSet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationManualCompleteSetArgs, 'examSetId'>>,
  bookmark?: Resolver<Maybe<ResolversTypes['Bookmark']>, ParentType, ContextType, RequireFields<MutationBookmarkArgs, 'questionId'>>,
  contact?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationContactArgs, never>>,
}>;

export type QuestionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  answers?: Resolver<Maybe<Array<Maybe<ResolversTypes['QuestionAnswer']>>>, ParentType, ContextType>,
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>,
  oldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  examSetQno?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  publicComments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>,
  privateComments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>,
  specialtyVotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpecialtyVote']>>>, ParentType, ContextType>,
  tagVotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['TagVote']>>>, ParentType, ContextType>,
  specialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['Specialty']>>>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType>,
  examSet?: Resolver<Maybe<ResolversTypes['ExamSet']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionAnswerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['QuestionAnswer'] = ResolversParentTypes['QuestionAnswer']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  index?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  isCorrect?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  correctPercent?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SpecialtyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Specialty'] = ResolversParentTypes['Specialty']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  semester?: Resolver<Maybe<ResolversTypes['Semester']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  oldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  questionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type TagResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  semester?: Resolver<Maybe<ResolversTypes['Semester']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  oldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  parent?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>,
  questionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type TagVoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TagVote'] = ResolversParentTypes['TagVote']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>,
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  vote?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SpecialtyVoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SpecialtyVote'] = ResolversParentTypes['SpecialtyVote']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  specialty?: Resolver<Maybe<ResolversTypes['Specialty']>, ParentType, ContextType>,
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  vote?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ExamSetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExamSet'] = ResolversParentTypes['ExamSet']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  season?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  semester?: Resolver<Maybe<ResolversTypes['Semester']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  questionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SemesterResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Semester'] = ResolversParentTypes['Semester']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  shortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  examSets?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExamSet']>>>, ParentType, ContextType>,
  specialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['Specialty']>>>, ParentType, ContextType>,
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType>,
  questionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isPrivate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  isAnonymous?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  likes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Like']>>>, ParentType, ContextType>,
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type UserAnswerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserAnswer'] = ResolversParentTypes['UserAnswer']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  answer?: Resolver<Maybe<ResolversTypes['QuestionAnswer']>, ParentType, ContextType>,
  answerTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType>,
  bookmarks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Bookmark']>>>, ParentType, ContextType, RequireFields<UserBookmarksArgs, never>>,
  answers?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserAnswer']>>>, ParentType, ContextType, RequireFields<UserAnswersArgs, never>>,
  specialtyVotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpecialtyVote']>>>, ParentType, ContextType>,
  tagVotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['TagVote']>>>, ParentType, ContextType>,
  likes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Like']>>>, ParentType, ContextType>,
  liked?: Resolver<Maybe<Array<Maybe<ResolversTypes['Like']>>>, ParentType, ContextType>,
  manualCompletedSets?: Resolver<Maybe<Array<Maybe<ResolversTypes['ManualCompletedSet']>>>, ParentType, ContextType>,
  publicComments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType, RequireFields<UserPublicCommentsArgs, never>>,
  privateComments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType, RequireFields<UserPrivateCommentsArgs, never>>,
  answeredSets?: Resolver<Maybe<Array<Maybe<ResolversTypes['AnsweredSet']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AnsweredSetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AnsweredSet'] = ResolversParentTypes['AnsweredSet']> = ResolversObject<{
  examSetId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type RoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type BookmarkResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Bookmark'] = ResolversParentTypes['Bookmark']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ManualCompletedSetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ManualCompletedSet'] = ResolversParentTypes['ManualCompletedSet']> = ResolversObject<{
  examSetId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LikeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = ResolversObject<{
  commentId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  userId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type MaintenanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Maintenance'] = ResolversParentTypes['Maintenance']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NoticeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Notice'] = ResolversParentTypes['Notice']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type Resolvers<ContextType = Context> = ResolversObject<{
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Question?: QuestionResolvers<ContextType>,
  QuestionAnswer?: QuestionAnswerResolvers<ContextType>,
  Specialty?: SpecialtyResolvers<ContextType>,
  Tag?: TagResolvers<ContextType>,
  TagVote?: TagVoteResolvers<ContextType>,
  SpecialtyVote?: SpecialtyVoteResolvers<ContextType>,
  ExamSet?: ExamSetResolvers<ContextType>,
  Semester?: SemesterResolvers<ContextType>,
  Comment?: CommentResolvers<ContextType>,
  UserAnswer?: UserAnswerResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
  AnsweredSet?: AnsweredSetResolvers<ContextType>,
  Role?: RoleResolvers<ContextType>,
  Bookmark?: BookmarkResolvers<ContextType>,
  Profile?: ProfileResolvers<ContextType>,
  ManualCompletedSet?: ManualCompletedSetResolvers<ContextType>,
  Like?: LikeResolvers<ContextType>,
  Maintenance?: MaintenanceResolvers<ContextType>,
  Notice?: NoticeResolvers<ContextType>,
  Upload?: GraphQLScalarType,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
