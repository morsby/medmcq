import gql from 'graphql-tag';

// Returns an array of questionIds
export const fetchQuestionIdsFromShareLink = gql`
  query ShareLink($shareId: String) {
    shareLink(shareId: $shareId)
  }
`;

export const createShareLink = gql`
  mutation CreateShareLink($questionIds: [Int]!) {
    createShareLink(questionIds: $questionIds)
  }
`;
