import { gql } from 'apollo-boost';
import Apollo from './Apollo';

class ShareBuilder {
  static createShareLink = async ({ questionIds }: { questionIds: number[] }) => {
    const mutation = gql`
      mutation($questionIds: [Int!]!) {
        createShareLink(questionIds: $questionIds)
      }
    `;

    const link = await Apollo.mutate<string>('createShareLink', mutation, { questionIds });

    return link;
  };
}

export default ShareBuilder;
