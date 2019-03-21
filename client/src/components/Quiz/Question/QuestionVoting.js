import React, { useEffect, useState } from 'react';
import { specialer, tags } from '../../../utils/common';
import { Button, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Divider, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as actions from '../../../actions';

const QuestionVoting = (props) => {
  const [chosenTags, setChosenTags] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let userTags = [];
    props.question.tagVotes.forEach((tagVote) => {
      if (_.includes(tagVote.users, props.user.username)) {
        userTags.push(tagVote.tag);
      }
    });

    setChosenTags(userTags);
  }, [props.question]);

  const userVote = () => {
    let votedSpecialty = null;
    props.question.votes.forEach((vote) => {
      const userIndex = _.indexOf(vote.users, props.user.username);
      if (userIndex !== -1) {
        votedSpecialty = vote.specialty;
      }
    });
    return votedSpecialty;
  };

  const specialties = () => {
    let specialties = [];
    const votedSpecialty = userVote();
    specialer[props.question.semester].forEach((speciale) => {
      specialties.push(
        <Button
          key={speciale.value}
          basic
          onClick={() => specialeVote(speciale.value)}
          color={votedSpecialty === speciale.value ? 'green' : null}
        >
          {speciale.text}
        </Button>
      );
    });

    return specialties;
  };

  const specialeVote = async (value) => {
    await props.voteSpecialty(value, props.user.username, props.question._id);
  };

  const tagVote = async () => {
    await props.voteTags(chosenTags, props.user.username, props.question._id);
    setMessage('Tags er tilføjet');
  };

  const onChange = async (e, { value }) => {
    setChosenTags(value);
    setMessage('');
  };

  // Sigurd TODO med den der mailklient
  const addTag = () => {};

  return (
    <div>
      <h5 style={{ color: 'grey', marginLeft: '3px' }}>
        Stem på speciale (Speciale med flest stemmer bliver vist)
      </h5>
      {specialties()}
      <Divider />
      <h5 style={{ color: 'grey', marginLeft: '3px' }}>
        Tilføj tags (kun tags der er valg af mere end 5 brugere, bliver vist)
      </h5>
      <Dropdown
        fluid
        multiple
        selection
        search
        options={tags[props.question.semester]}
        value={chosenTags}
        onChange={onChange}
      />
      <Divider hidden />
      <Button basic color="green" onClick={tagVote}>
        Tilføj tags
      </Button>
      <Button basic color="yellow" onClick={addTag}>
        Foreslå nyt tag
      </Button>
      {message && <Message color="green">{message}</Message>}
    </div>
  );
};

QuestionVoting.propTypes = {
  voteSpecialty: PropTypes.func,
  user: PropTypes.object,
  question: PropTypes.object,
  voteTags: PropTypes.func
};

export default connect(
  null,
  actions
)(QuestionVoting);
