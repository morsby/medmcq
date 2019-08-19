import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

import Semester from '../../models/semester';
import { subserviceContext } from '../apolloServer';

export const typeDefs = gql`
  type Semester @key(fields: "id") {
    id: Int!
    value: Int
    name: String
  }

  extend type Question @key(fields: "id") {
    id: Int! @external
    examSetId: Int @external
    semester: Semester @requires(fields: "examSetId")
  }

  extend type ExamSet @key(fields: "id") {
    id: Int! @external
    semesterId: Int! @external
    semester: Semester @requires(fields: "semesterId")
  }

  input SemesterFilter {
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

  type ListMetadata {
    count: Int!
  }

  type Query {
    Semester(id: Int): Semester

    allSemesters(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SemesterFilter
    ): [Semester]

    _allSemestersMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: SemesterFilter
    ): ListMetadata
  }

  type Mutation {
    createSemester(title: String!, views: Int!, user_id: ID!): Semester
    updateSemester(id: ID!, title: String!, views: Int!, user_id: ID!): Semester
    deleteSemester(id: ID!): Semester
  }
`;

export const resolvers = {
  Query: {
    allSemesters: async () => Semester.query().select('id'),
    Semester: (_root, { id }) => ({ id })
  },

  Semester: {
    __resolveReference: (semester, { dataloaders }) => {
      return dataloaders.semesters.byIds.load(semester.id);
    },

    value: async (parent, _args, ctxt) => {
      const { value } = await ctxt.dataloaders.semesters.byIds.load(parent.id);
      return value;
    },
    name: async (parent, _args, ctxt) => {
      const { name } = await ctxt.dataloaders.semesters.byIds.load(parent.id);
      return name;
    }
  },
  ExamSet: {
    semester: async ({ id }, _args, { dataloaders }) => {
      const { semesterId } = await dataloaders.examSets.byIds.load(id);
      return { __typename: 'Semester', id: semesterId };
    }
  },

  Question: {
    semester: ({ examSetId }, _args, ctxt) =>
      ctxt.dataloaders.semesters.byExamSetIds.load(examSetId)
  },

  Mutation: {
    createCorrectAnswer: async () => {
      return 'done';
    }
  }
};

export const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => subserviceContext(req)
});
