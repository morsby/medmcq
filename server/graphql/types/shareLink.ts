import { gql } from 'apollo-server-express';
import ShareLink from '../../models/shareLink';
import crypto from 'crypto';

export const typeDefs = gql`
  extend type Query {
    shareLink(shareId: String): [String]
  }

  extend type Mutation {
    createShareLink(questionIds: [String]!, published: Boolean): String
  }
`;

export const resolvers = {
  Query: {
    shareLink: async (args, { shareId }) => {
      const ids = await ShareLink.query()
        .where('shareId', '=', shareId)
        .select('questionId');

      let questionIds = [];
      ids.forEach((id) => {
        questionIds.push(id.questionId);
      });

      return questionIds;
    }
  },

  Mutation: {
    createShareLink: async (args, { questionIds }) => {
      const randomId = crypto
        .randomBytes(16)
        .join('')
        .substring(0, 10);

      let links: any = [];
      for (const id of questionIds) {
        links.push({
          shareId: Number(randomId),
          questionId: Number(id)
        });
      }

      const shareLink = await ShareLink.query()
        .insertGraphAndFetch(links)
        .first();

      return shareLink.shareId;
    }
  }
};
