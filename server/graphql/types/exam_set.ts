import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { subserviceContext } from '../apolloServer';
import ExamSet from '../../models/exam_set';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  type ExamSet @key(fields: "id") {
    id: Int!
    semesterId: Int!
    season: String
    year: Int
  }

  extend type Question @key(fields: "id") {
    id: Int! @external
    examSetId: Int @external
    examSet: ExamSet @requires(fields: "examSetId")
  }

  extend type Semester @key(fields: "id") {
    id: Int! @external
    examSets: [ExamSet] @requires(fields: "id")
  }

  input ExamSetFilter {
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
    ExamSet(id: Int): ExamSet

    allExamSets(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: ExamSetFilter
    ): [ExamSet]

    _allExamSetsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: ExamSetFilter
    ): ListMetadata
  }

  type Mutation {
    createExamSet(title: String!, views: Int!, user_id: ID!): ExamSet
    updateExamSet(id: ID!, title: String!, views: Int!, user_id: ID!): ExamSet
    deleteExamSet(id: ID!): ExamSet
  }
`;

export const resolvers = {
  Query: {
    allExamSets: async () => ExamSet.query().select('id'),
    ExamSet: (_root, { id }) => ({ id })
  },

  ExamSet: {
    __resolveReference: (examSet, { dataloaders }) => {
      return dataloaders.examSets.byIds.load(examSet.id);
    },
    season: async ({ id }, _args, { dataloaders }) => {
      const { season } = await dataloaders.examSets.byIds.load(id);
      return season;
    },
    year: async ({ id }, _args, { dataloaders }) => {
      const { year } = await dataloaders.examSets.byIds.load(id);
      return year;
    },
    semester: async ({ id }, _args, { dataloaders }) => {
      const { semesterId } = await dataloaders.examSets.byIds.load(id);
      return { __typename: 'Semester', id: semesterId };
    }
  },
  Question: {
    examSet: async ({ examSetId }) => {
      return { __typename: 'ExamSet', id: examSetId };
    }
  },
  Semester: {
    examSets: async ({ id }, _args, { dataloaders }) => dataloaders.examSets.bySemesterIds.load(id)
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
