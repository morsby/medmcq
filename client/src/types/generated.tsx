import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type Answer = {
   __typename?: 'Answer';
  id?: Maybe<Scalars['Int']>;
  answer?: Maybe<Scalars['Int']>;
  question?: Maybe<Question>;
  answerTime?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type AnsweredSet = {
   __typename?: 'AnsweredSet';
  examSetId?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};

export type AnswerInput = {
  answer: Scalars['Int'];
  questionId: Scalars['Int'];
  answerTime: Scalars['Int'];
};

export type Bookmark = {
   __typename?: 'Bookmark';
  id?: Maybe<Scalars['Int']>;
  question?: Maybe<Question>;
  user?: Maybe<User>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

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

export type Like = {
   __typename?: 'Like';
  commentId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type ManualCompletedSet = {
   __typename?: 'ManualCompletedSet';
  examSetId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  createShareLink?: Maybe<Scalars['Int']>;
  reportQuestion?: Maybe<Scalars['String']>;
  createQuestion?: Maybe<Question>;
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
  data: AnswerInput;
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

export type Profile = {
   __typename?: 'Profile';
  id?: Maybe<Scalars['Int']>;
};

export type Query = {
   __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  shareLink?: Maybe<Array<Maybe<Scalars['String']>>>;
  questions?: Maybe<Array<Question>>;
  examSets?: Maybe<Array<Maybe<ExamSet>>>;
  semesters?: Maybe<Array<Maybe<Semester>>>;
  semester?: Maybe<Semester>;
  user?: Maybe<User>;
  checkUsernameAvailability?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<User>;
};


export type QueryShareLinkArgs = {
  shareId?: Maybe<Scalars['String']>;
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

export type Question = {
   __typename?: 'Question';
  id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
  answer1?: Maybe<QuestionAnswer>;
  answer2?: Maybe<QuestionAnswer>;
  answer3?: Maybe<QuestionAnswer>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  oldId?: Maybe<Scalars['String']>;
  examSetQno?: Maybe<Scalars['Int']>;
  publicComments?: Maybe<Array<Maybe<Comment>>>;
  privateComments?: Maybe<Array<Maybe<Comment>>>;
  correctAnswers?: Maybe<Array<Maybe<Scalars['Int']>>>;
  specialtyVotes?: Maybe<Array<Maybe<SpecialtyVote>>>;
  tagVotes?: Maybe<Array<Maybe<TagVote>>>;
  specialties?: Maybe<Array<Maybe<Specialty>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  examSet?: Maybe<ExamSet>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type QuestionAnswer = {
   __typename?: 'QuestionAnswer';
  answer?: Maybe<Scalars['String']>;
  correctPercent?: Maybe<Scalars['Int']>;
};

export type QuestionFilterInput = {
  text?: Maybe<Scalars['String']>;
  specialtyIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  tagIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  semesterId?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
  season?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  n?: Maybe<Scalars['Int']>;
  examSetId?: Maybe<Scalars['Int']>;
  onlyNew?: Maybe<Scalars['Boolean']>;
  onlyWrong?: Maybe<Scalars['Boolean']>;
  commentIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  profile?: Maybe<Scalars['Boolean']>;
  search?: Maybe<Scalars['String']>;
};

export type QuestionInput = {
  answer1: Scalars['String'];
  answer2: Scalars['String'];
  answer3: Scalars['String'];
  correctAnswers: Array<Scalars['Int']>;
  text: Scalars['String'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  examSetId: Scalars['Int'];
};

export type Role = {
   __typename?: 'Role';
  id?: Maybe<Scalars['Int']>;
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

export type SpecialtyVote = {
   __typename?: 'SpecialtyVote';
  id?: Maybe<Scalars['Int']>;
  specialty?: Maybe<Specialty>;
  question?: Maybe<Question>;
  user?: Maybe<User>;
  vote?: Maybe<Scalars['Int']>;
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


export type User = {
   __typename?: 'User';
  id?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  bookmarks?: Maybe<Array<Maybe<Bookmark>>>;
  answers?: Maybe<Array<Maybe<Answer>>>;
  specialtyVotes?: Maybe<Array<Maybe<SpecialtyVote>>>;
  tagVotes?: Maybe<Array<Maybe<TagVote>>>;
  likes?: Maybe<Array<Maybe<Like>>>;
  liked?: Maybe<Array<Maybe<Like>>>;
  manualCompletedSets?: Maybe<Array<Maybe<ManualCompletedSet>>>;
  publicComments?: Maybe<Array<Maybe<Comment>>>;
  privateComments?: Maybe<Array<Maybe<Comment>>>;
  answeredSets?: Maybe<Array<Maybe<AnsweredSet>>>;
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

export type UserAvailableInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type UserEditInput = {
  password?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type UserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email?: Maybe<Scalars['String']>;
};

export type VoteInput = {
  questionId: Scalars['Int'];
  metadataId: Scalars['Int'];
  vote?: Maybe<Scalars['Int']>;
};


