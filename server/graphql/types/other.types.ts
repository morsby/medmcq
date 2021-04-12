import { gql } from 'apollo-server-express';
import { Resolvers } from 'types/resolvers-types';
import { urls } from 'misc/vars';
import sgMail from '@sendgrid/mail';
import { knex } from 'config/objection';

export const typeDefs = gql`
  extend type Query {
    maintenance: Maintenance
    notice: Notice
  }

  type Maintenance {
    message: String
  }

  type Notice {
    message: String
    color: String
  }

  extend type Mutation {
    contact(data: ContactInput): String
  }

  input ContactInput {
    subject: String
    message: String
  }
`;

export const resolvers: Resolvers = {
  Query: {
    maintenance: async () => {
      return knex('maintenance').first();
    },
    notice: async () => {
      return knex('notice').first();
    }
  },

  Mutation: {
    contact: async (root, { data: { subject, message } }) => {
      message = message.replace(/(.)\n(.)/g, '$1<br>$2');
      const msg = {
        to: urls.issue,
        from: {
          name: 'MedMCQ',
          email: urls.fromEmail
        },
        subject: subject,
        text: message + '<br><br><em>Sendt via kontaktformularen</em>'
      };

      await sgMail.send(msg);
      return 'Message sent';
    }
  }
};
