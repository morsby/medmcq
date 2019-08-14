import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import dataloaders from '../dataloaders';
import Semester from '../../models/semester';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  type Semester @key(fields: "id") {
    id: Int!
    value: Int
    name: String
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

  Mutation: {
    createCorrectAnswer: async () => {
      return 'done';
    }
  }
};

export const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => ({ dataloaders: dataloaders(Number(req.headers['user-id'])) })
});
