import { gql } from 'apollo-server-express';
import ExamSet from '../../models/exam_set';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  type ExamSet {
    id: ID
    season: String
    year: Int
    semester: Semester
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

  extend type Query {
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

  extend type Mutation {
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
    season: async ({ id }, _args, ctxt) => {
      const { season } = await ctxt.dataloaders.examSets.byIds.load(id);
      return season;
    },
    year: async ({ id }, _args, ctxt) => {
      const { year } = await ctxt.dataloaders.examSets.byIds.load(id);
      return year;
    },
    semester: async ({ id }, _args, ctxt) => {
      const { semesterId } = await ctxt.dataloaders.examSets.byIds.load(id);
      return ctxt.dataloaders.semesters.byIds.load(semesterId);
    }
  },

  Mutation: {
    createCorrectAnswer: async () => {
      return 'done';
    }
  }
};
