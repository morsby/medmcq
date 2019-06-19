import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Label } from 'semantic-ui-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from 'actions';

const QuestionMetadataLabel = ({ metadata, user, question, children, type, voteAction }) => {
  const vote = async (vote) => {
    if (isVotedOn(metadata) === vote) {
      vote = 'delete';
    }
    voteAction(type, question.id, metadata.id, vote, user.id);
  };

  const isVotedOn = (metadata) => {
    let userVote;
    if (type === 'specialty') {
      userVote = _.get(question, ['userSpecialtyVotes', metadata.id], {}).value;
    } else {
      userVote = _.get(question, ['userTagVotes', metadata.id], {}).value;
    }
    return userVote || null;
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
              color={isVotedOn(metadata) === 1 ? 'green' : null}
              style={{ margin: '2px', cursor: 'pointer' }}
            />
            <Icon
              onClick={() => vote(-1)}
              name="arrow down"
              color={isVotedOn(metadata) === -1 ? 'red' : null}
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
