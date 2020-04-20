import { gql } from 'apollo-server-express';
import { Resolvers } from 'types/resolvers-types';
import { urls } from 'misc/vars';
import sgMail from '@sendgrid/mail';

export const typeDefs = gql`
  extend type Mutation {
    contact(data: ContactInput): String
  }

  input ContactInput {
    subject: String
    message: String
  }
`;

export const resolvers: Resolvers = {
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
