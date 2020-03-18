import { gql } from 'apollo-server-express';
import ShareLink from '../../models/shareLink';
import crypto from 'crypto';
import { Resolvers } from 'types/resolvers-types';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  extend type Query {
    shareLink(shareId: Int): [Question]
  }

  extend type Mutation {
    createShareLink(questionIds: [Int!]!): String
  }
`;

export const resolvers: Resolvers = {
  Query: {
    shareLink: async (_args, { shareId }) => {
      const shareObjs = await ShareLink.query()
        .where('shareId', '=', shareId)
        .select('questionId');
      return shareObjs.map((so) => ({ id: so.questionId }));
    }
  },

  Mutation: {
    createShareLink: async (_args, { questionIds }, ctx) => {
      if (!ctx.user) throw new Error('Not logged in');
      const randomId = crypto
        .randomBytes(8)
        .join('')
        .substring(0, 10);

      // HVIS det utænkeligt skulle ske, at ID'et er det samme
      const alreadyExists = await ShareLink.query()
        .where('shareId', '=', randomId)
        .first();
      if (alreadyExists) throw new Error('The random ID already exists (one in a million error!)');

      // Opret links, så der kan sættes flere ind i SQL
      let links: any = [];
      for (const id of questionIds) {
        links.push({
          shareId: randomId,
          questionId: Number(id),
          userId: ctx.user.id
        });
      }

      const shareLink = await ShareLink.query()
        .insertGraphAndFetch(links)
        .first();

      // Da shareID er det samme for alle, returneres blot det første tilbage
      return shareLink.shareId;
    }
  }
};
