import { gql } from 'apollo-server-express';
import { Resolvers } from 'types/resolvers-types';
import Notification from 'models/notification.class';

export const notificationTypeDefs = gql`
  extend type Query {
    notifications: [Notification]
  }

  extend type Mutation {
    toggleReadNotification(id: Int): Notification
    toggleReadAllNotifications: String
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

  Mutation: {
    toggleReadNotification: async (root, { id }, ctx) => {
      let notification = await Notification.query().findById(id);
      if (notification.userId !== ctx.user.id) throw new Error('Not permitted');
      notification = await notification
        .$query()
        .updateAndFetch({ isRead: notification.isRead ? 0 : 1 }); // Toggle isRead
      return { id: notification.id };
    },
    toggleReadAllNotifications: async (root, args, ctx) => {
      await Notification.query().where({ userId: ctx.user.id }).update({ isRead: 1 });
      return 'Updated';
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
