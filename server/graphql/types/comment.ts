import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { subserviceContext } from '../apolloServer';
import User from '../../models/user';
import Comment from '../../models/question_comment';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
/*
  extend type User @key(fields: "id") {
    id: Int! @external
    publicComments: [Comment]
    privateComments: [Comment]
  }
  */
export const typeDefs = gql`
  type Comment @key(fields: "id") {
    id: Int!
    userId: Int!
    questionId: Int!
    text: String!
    private: Boolean!
    createdAt: String
  }

  extend type Question @key(fields: "id") {
    id: Int! @external
    publicComments: [Comment]
    privateComments: [Comment]
  }

  extend type User @key(fields: "id") {
    id: Int! @external
    publicComments: [Comment]
    privateComments: [Comment]
  }

  input CommentFilter {
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
    Comment(id: Int): Comment

    allComments(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: CommentFilter
    ): [Comment]

    _allCommentsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: CommentFilter
    ): ListMetadata
  }

  type Mutation {
    createComment(title: String!, views: Int!, user_id: ID!): Comment
    updateComment(id: ID!, title: String!, views: Int!, user_id: ID!): Comment
    deleteComment(id: ID!): Comment
  }
`;

export const resolvers = {
  Query: {
    allComments: async (_root, _args, { userId }) => {
      const user = await User.query()
        .findById(userId)
        .joinRelation('role')
        .select('user.*')
        .select('role.level as level');
      if ((user || {})['level'] >= 100) {
        return Comment.query().select('id');
      } else {
        throw new AuthenticationError('not authorized');
      }
    },
    Comment: (_root, { id }) => ({ id })
  },

  Comment: {
    __resolveReference: (comment, { dataloaders }) => {
      return dataloaders.comments.byIds.load(comment.id);
    },
    userId: async ({ id }, _args, { dataloaders }) => {
      const { userId } = await dataloaders.comments.byIds.load(id);
      return userId;
    },
    questionId: async ({ id }, _args, { dataloaders }) => {
      const { questionId } = await dataloaders.comments.byIds.load(id);
      return questionId;
    },
    text: async ({ id }, _args, { dataloaders }) => {
      const { text } = await dataloaders.comments.byIds.load(id);
      return text;
    },
    createdAt: async ({ id }, _args, { dataloaders }) => {
      const { createdAt } = await dataloaders.comments.byIds.load(id);
      return new Date(createdAt).toISOString();
    }
  },
  Question: {
    publicComments: async ({ id: questionId }, _args, { dataloaders }) => {
      const comments = await dataloaders.comments.byQuestionIds.load(questionId);
      return comments.filter((c) => c.private == false);
    },
    privateComments: async ({ id: questionId }, _args, { dataloaders }) => {
      const comments = await dataloaders.comments.byQuestionIds.load(questionId);
      return comments.filter((c) => c.private == true);
    }
  },
  User: {
    publicComments: async ({ id: userId }, _args, { dataloaders }) => {
      const comments = await dataloaders.comments.byUserIds.load(userId);
      return comments.filter((c) => c.private == false);
    },
    privateComments: async ({ id: userId }, _args, { dataloaders }) => {
      const comments = await dataloaders.comments.byUserIds.load(userId);
      return comments.filter((c) => c.private == true);
    }
  },

  Mutation: {
    createComment: async () => {
      return 'done';
    }
  }
};

export const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => subserviceContext(req)
});
