import React from 'react';
import { Icon, Label, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/questions';

const QuestionMetadataLabel = ({ metadata, user, question, children, type, voteAction }) => {
  const vote = async (vote) => {
    voteAction(type, question._id, metadata._id, vote, user._id);
  };

  const isVotedOn = (metadata) => {
    const userIndex = _.findIndex(metadata.users, { user: user._id });
    if (userIndex !== -1) {
      if (metadata.users[userIndex].vote === 1) {
        return 'upvote';
      } else if (metadata.users[userIndex].vote === -1) {
        return 'downvote';
      } else {
        return null;
      }
    }
  };

  return (
    <>
      <Label style={{ marginTop: '2px' }} size="small">
        {children}
        {user && (
          <>
            {' '}
            <Icon
              onClick={() => vote(1)}
              name="arrow up"
              color={isVotedOn(metadata) === 'upvote' ? 'green' : null}
              style={{ margin: '2px', cursor: 'pointer' }}
              disabled={isVotedOn(metadata) === 'upvote' ? true : false}
            />
            <Icon
              onClick={() => vote(-1)}
              name="arrow down"
              color={isVotedOn(metadata) === 'downvote' ? 'red' : null}
              disabled={isVotedOn(metadata) === 'downvote' ? true : false}
              style={{ margin: '2px', cursor: 'pointer' }}
            />{' '}
            {metadata.votes}
          </>
        )}
      </Label>
    </>
  );
};

export default connect(
  null,
  actions
)(QuestionMetadataLabel);
