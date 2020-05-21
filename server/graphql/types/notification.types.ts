import { gql } from 'apollo-server-express';
import { Resolvers } from 'types/resolvers-types';
import Notification from 'models/notification.class';

export const notificationTypeDefs = gql`
  extend type Query {
    notifications: [Notification]
  }

  type Notification {
    id: Int
    message: String
    user: User
    isRead: Boolean
    createdAt: String
    updatedAt: String
  }
`;

export const notificationResolvers: Resolvers = {
  Query: {
    notifications: async (root, args, ctx) => {
      if (!ctx.user) return [];
      const notifications = await Notification.query()
        .where({ userId: ctx.user.id })
        .orderBy('createdAt', 'desc');
      return notifications.map((n) => ({ id: n.id }));
    }
  },

  Notification: {
    id: ({ id }) => id,
    user: async ({ id }, args, ctx) => {
      const notification = await ctx.notificationLoader.load(id);
      return { id: notification.userId };
    },
    message: async ({ id }, args, ctx) => {
      const notification = await ctx.notificationLoader.load(id);
      return notification.message;
    },
    isRead: async ({ id }, args, ctx) => {
      const notification = await ctx.notificationLoader.load(id);
      return !!notification.isRead;
    },
    createdAt: async ({ id }, args, ctx) => {
      const notification = await ctx.notificationLoader.load(id);
      return notification.createdAt.toISOString();
    },
    updatedAt: async ({ id }, args, ctx) => {
      const notification = await ctx.notificationLoader.load(id);
      return notification.updatedAt.toISOString();
    }
  }
};
