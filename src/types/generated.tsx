export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Any: any;
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
  notifications?: Maybe<Array<Maybe<Notification>>>;
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


export type QueryNotificationsArgs = {
  semesterId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  createShareLink?: Maybe<Scalars['String']>;
  reportQuestion?: Maybe<Scalars['String']>;
  createQuestion?: Maybe<Question>;
  updateQuestion?: Maybe<Question>;
  ignoreQuestion?: Maybe<Question>;
  voteTag?: Maybe<Question>;
  voteSpecialty?: Maybe<Question>;
  suggestTag?: Maybe<Scalars['String']>;
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
  toggleReadNotification?: Maybe<Notification>;
  toggleReadAllNotifications?: Maybe<Scalars['String']>;
  createLog?: Maybe<Scalars['String']>;
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


export type MutationIgnoreQuestionArgs = {
  id?: Maybe<Scalars['Int']>;
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


export type MutationToggleReadNotificationArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type MutationCreateLogArgs = {
  data?: Maybe<LogInput>;
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
  isIgnored?: Maybe<Scalars['Boolean']>;
};

export type QuestionAnswer = {
  __typename?: 'QuestionAnswer';
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  isCorrect?: Maybe<Scalars['Boolean']>;
  text?: Maybe<Scalars['String']>;
  correctPercent?: Maybe<Scalars['Int']>;
  question?: Maybe<Question>;
  explanation?: Maybe<Scalars['String']>;
};

export type QuestionInput = {
  id?: Maybe<Scalars['Int']>;
  answers?: Maybe<Array<Maybe<QuestionAnswerInput>>>;
  text: Scalars['String'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  examSetId?: Maybe<Scalars['Int']>;
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
  reexam?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  questionCount?: Maybe<Scalars['Int']>;
  hadHelp?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
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
  ignored?: Maybe<Array<Maybe<Question>>>;
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


export type UserIgnoredArgs = {
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

export type Notification = {
  __typename?: 'Notification';
  id?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  isRead?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  semester?: Maybe<Semester>;
};

export type LogInput = {
  name?: Maybe<Scalars['String']>;
};

export type Log = {
  __typename?: 'Log';
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


