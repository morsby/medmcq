import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { subserviceContext } from '../apolloServer';
import User from '../../models/user';

export const typeDefs = gql`
  type User @key(fields: "id") {
    id: Int!
    username: String!
    email: String
    roleId: Int!
  }

  extend type Comment @key(fields: "id") {
    id: Int! @external
    userId: Int! @external
    user: User @requires(fields: "userId")
  }

  input UserFilter {
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
    User(id: Int): User

    allUsers(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: UserFilter
    ): [User]

    _allUsersMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: UserFilter
    ): ListMetadata
  }

  type Mutation {
    createUser(title: String!, views: Int!, user_id: ID!): User
    updateUser(id: ID!, title: String!, views: Int!, user_id: ID!): User
    deleteUser(id: ID!): User
  }
`;

export const resolvers = {
  Query: {
    allUsers: async (_root, _args, { userId }) => {
      const user = await User.query()
        .findById(userId)
        .joinRelation('role')
        .select('user.*')
        .select('role.level as level');
      if ((user || {})['level'] >= 100) {
        return User.query().select('id');
      } else {
        throw new AuthenticationError('not authorized');
      }
    },
    User: async (_root, { id }, { userId }) => {
      const user = await User.query()
        .findById(userId)
        .joinRelation('role')
        .select('user.*')
        .select('role.level as level');
      if ((user || {})['level'] >= 100 || id === userId) {
        return { id };
      } else {
        throw new AuthenticationError('not authorized');
      }
    }
  },

  User: {
    __resolveReference: (user, { dataloaders }) => {
      return dataloaders.users.byIds.load(user.id);
    },
    username: async ({ id }, _args, { dataloaders }) => {
      try {
        const { username } = await dataloaders.users.byIds.load(id);
        return username;
      } catch (err) {
        return err;
      }
    },
    email: async ({ id }, _args, { dataloaders }) => {
      const { email } = await dataloaders.users.byIds.load(id);
      return email;
    },
    roleId: async ({ id }, _args, { dataloaders }) => {
      const { roleId } = await dataloaders.users.byIds.load(id);
      return roleId;
    }
  },

  // Relations
  Comment: {
    user: ({ userId }) => ({ __typename: 'User', id: userId })
  },

  Mutation: {
    createuser: async () => {
      return 'done';
    }
  }
};

export const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => subserviceContext(req)
});
