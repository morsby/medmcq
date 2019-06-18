import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Label } from 'semantic-ui-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from 'actions';

const QuestionMetadataLabel = ({ metadata, user, question, children, type, voteAction }) => {
  const vote = async (vote) => {
    voteAction(type, question.id, metadata.id, vote, user.id);
  };

  const isVotedOn = (metadata) => {
    let userVote;
    if (type === 'specialty') {
      userVote = _.get(question, ['userSpecialtyVotes', metadata.id], {}).value;
    } else {
      userVote = _.get(question, ['userTagVotes', metadata.id], {}).value;
    }
    if (userVote === 1) {
      return 'upvote';
    } else if (userVote === -1) {
      return 'downvote';
    } else {
      return null;
    }
  };

  let votes;
  if (type === 'specialty') {
    votes = (question.specialties[metadata.id] || {}).votes;
  } else {
    votes = (question.tags[metadata.id] || {}).votes;
  }

  return (
    <>
      <Label style={{ marginTop: '2px' }} size="small">
        {children}
        {user && (
          <>
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
            {votes}
          </>
        )}
      </Label>
    </>
  );
};

QuestionMetadataLabel.propTypes = {
  metadata: PropTypes.object,
  user: PropTypes.object,
  question: PropTypes.object,
  children: PropTypes.node,
  type: PropTypes.string,
  voteAction: PropTypes.func
};

export default connect(
  null,
  actions
)(QuestionMetadataLabel);
