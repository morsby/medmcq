import gql from 'graphql-tag';
import API from './API.class';

class ShareBuilder {
  static createShareLink = async ({ questionIds }: { questionIds: number[] }) => {
    const mutation = gql`
      mutation($questionIds: [Int!]!) {
        createShareLink(questionIds: $questionIds)
      }
    `;

    const link = await API.mutate<string>('createShareLink', mutation, { questionIds });

    return link;
  };
}

export default ShareBuilder;
