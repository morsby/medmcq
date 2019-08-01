import { gql } from 'apollo-server-express';
import ShareLink from '../../models/shareLink';
import crypto from 'crypto';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  extend type Query {
    shareLink(shareId: String): [String]
  }

  extend type Mutation {
    createShareLink(questionIds: [String]!): String
  }
`;

export const resolvers = {
  Query: {
    shareLink: async (_args, { shareId }) => {
      const ids = await ShareLink.query()
        .where('shareId', '=', shareId)
        .select('questionId');

      // Hent spørgsmåls ID'er fra det share,
      // da questions så igen hentes fra frontend (gennem normal ID logik)
      let questionIds = [];
      ids.forEach((id) => {
        questionIds.push(id.questionId);
      });

      return questionIds;
    }
  },

  Mutation: {
    createShareLink: async (_args, { questionIds }) => {
      const randomId = crypto
        .randomBytes(16)
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
          shareId: Number(randomId),
          questionId: Number(id)
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
