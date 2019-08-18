import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import Question from '../../models/question';
import { subserviceContext } from '../apolloServer';

export const typeDefs = gql`
  type Question @key(fields: "id") {
    id: Int!
    oldId: String
    text: String
    image: String
    answer1: String
    answer2: String
    answer3: String
    correctAnswers: [Int]
    examSetId: Int
    examSetQno: Int
    specialties: [SpecialtyVote]
    tags: [TagVote]
  }

  extend type ExamSet @key(fields: "id") {
    id: Int! @external
    questions: [Question]
    questionCount: Float
  }

  extend type Semester @key(fields: "id") {
    id: Int! @external
    questions: [Question]
    questionCount: Float
  }

  extend type Comment @key(fields: "id") {
    id: Int! @external
    questionId: Int! @external
    question: Question @requires(fields: "questionId")
  }

  type SpecialtyVote {
    id: ID
  }
  type TagVote {
    id: ID
  }

  input QuestionFilter {
    q: String
    id: ID
    title: String
    views: Int
    views_lt: Int
    views_lte: Int
    views_gt: Int
    views_gte: Int
    user_id: ID
  }

  type qListMetadata {
    count: Int!
  }

  type Query {
    Question(id: ID!): Question

    allQuestions(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: QuestionFilter
    ): [Question]

    _allQuestionsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: QuestionFilter
    ): qListMetadata
  }

  extend type Mutation {
    createQuestion(title: String!, views: Int!, user_id: ID!): Question
    updateQuestion(id: ID!, title: String!, views: Int!, user_id: ID!): Question
    deleteQuestion(id: ID!): Question
  }
`;

export const resolvers = {
  Query: {
    allQuestions: async () => Question.query().select('id'),

    Question: (_root, { id }, ctxt) => ctxt.dataloaders.questions.questionsByIds.load(id),

    _allQuestionsMeta: async () => Question.query().select('id')
  },

  Question: {
    __resolveReference: (question, { dataloaders }) => {
      return dataloaders.questions.questionsByIds.load(question.id);
    },
    text: async ({ id }, _, ctxt) => {
      const { text } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return text;
    },

    answer1: async ({ id }, _, ctxt) => {
      const { answer1 } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return answer1;
    },
    answer2: async ({ id }, _, ctxt) => {
      const { answer2 } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return answer2;
    },
    answer3: async ({ id }, _, ctxt) => {
      const { answer3 } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return answer3;
    },
    // TODO: få en bedre nesting af denne
    correctAnswers: async ({ id }, _args, ctxt) => {
      const answers = await ctxt.dataloaders.correctAnswers.byQuestionIds.load(id);
      return answers.map((a) => a.answer);
    },
    publicComments: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.publicCommentsByQuestions.load(question),
    privateComments: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.privateCommentsByQuestionIds.load(question.id),
    specialties: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.specialtiesByQuestionIds.load(question.id)
  },

  qListMetadata: {
    count: (questions) => questions.length
  },

  // Relations
  ExamSet: {
    questions: async ({ id }, _args, { dataloaders }) =>
      dataloaders.questions.byExamSetIds.load(id),
    questionCount: async ({ id }, _args, { dataloaders }) => {
      const questions = await dataloaders.questions.byExamSetIds.load(id);
      return questions.length;
    }
  },
  Semester: {
    questions: async ({ id }, _args, { dataloaders }) =>
      dataloaders.questions.bySemesterIds.load(id),
    questionCount: async ({ id }, _args, { dataloaders }) => {
      const questions = await dataloaders.questions.bySemesterIds.load(id);
      return questions.length;
    }
  },
  Comment: {
    question: async ({ questionId }, _args, { dataloaders }) => ({
      __typename: 'Question',
      id: questionId
    })
  },

  Mutation: {
    createQuestion: async () => {
      return 'done';
    }
  }
};

export const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => subserviceContext(req)
});
