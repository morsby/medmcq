import { gql } from 'apollo-boost';

// Returns an array of questionIds
export const fetchQuestionIdsFromShareLink = gql`
  query ShareLink($shareId: String) {
    shareLink(shareId: $shareId)
  }
`;

export const createShareLink = gql`
  mutation CreateShareLink($questionIds: [String]!) {
    createShareLink(questionIds: $questionIds)
  }
`;
