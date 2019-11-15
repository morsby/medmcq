import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  type User {
    id: Int
    username: String
    password: String
    role: Role
    bookmarks: [Bookmark]
    answers: [Answer]
    specialtyVotes: [SpecialtyVote]
    tagVotes: [TagVote]
    likes: [Like]
    manualCompletedSets: [ManualCompletedSet]
    publicComments: [Comment]
    privateComments: [Comment]
  }

  type Role {
    id: Int
  }

  type Bookmark {
    id: Int
  }

  type ManualCompletedSet {
    id: Int
  }
`;

export const resolvers = {
  User: {
    id: ({ id }) => id,
    username: async ({ id }, _, ctx: Context) => {
      const user = await ctx.userLoaders.userLoader.load(id);
      return user.username;
    },
    password: async ({ id }, _, ctx: Context) => {
      const user = await ctx.userLoaders.userLoader.load(id);
      return user.password;
    },
    role: async ({ id }, _, ctx: Context) => {
      const user = await ctx.userLoaders.userLoader.load(id);
      return { id: user.roleId };
    }
  }
};
