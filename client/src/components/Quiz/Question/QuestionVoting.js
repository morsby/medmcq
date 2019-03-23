import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import _ from 'lodash';

import { specialer, tags } from '../../../utils/common';

import { Button, Message, Input } from 'semantic-ui-react';
import { Divider, Dropdown } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

const QuestionVoting = (props) => {
  const [chosenTags, setChosenTags] = useState([]);
  const [chosenSpecialties, setChosenSpecialties] = useState([]);
  const [tagMessage, setTagMessage] = useState('');
  const [specialtyMessage, setSpecialtyMessage] = useState('');
  const [newTag, setNewTag] = useState('');
  const [addingNewTag, setAddingNewTag] = useState(false);

  useEffect(() => {
    let userSpecialties = [];
    props.question.votes.forEach((vote) => {
      if (_.includes(vote.users, props.user._id)) {
        userSpecialties.push(vote.specialty);
      }
    });
    setChosenSpecialties(userSpecialties);

    let userTags = [];
    props.question.tagVotes.forEach((tagVote) => {
      if (_.includes(tagVote.users, props.user._id)) {
        userTags.push(tagVote.tag);
      }
    });
    setChosenTags(userTags);

    setTagMessage('');
    setSpecialtyMessage('');
  }, [props.question]);

  const specialtyVote = async () => {
    await props.voteSpecialty(chosenSpecialties, props.user._id, props.question._id);
    setSpecialtyMessage('Du har stemt på specialerne');
  };

  const tagVote = async () => {
    await props.voteTags(chosenTags, props.user._id, props.question._id);
    setTagMessage('Tags er tilføjet');
  };

  const onChangeSpecialties = async (e, { value }) => {
    setChosenSpecialties(value);
    setSpecialtyMessage('');
  };

  const onChangeTags = async (e, { value }) => {
    setChosenTags(value);
    setTagMessage('');
  };

  const onAddingNewTag = () => {
    setAddingNewTag(true);
  };

  const handleNewTag = (e, { value }) => {
    setNewTag(value);
  };
  // Sigurd TODO med den der mailklient
  const suggestTag = () => {
    props.questionReport({
      type: 'suggest_tag',
      data: {
        tag: newTag,
        question: props.question
      }
    });
    setNewTag('');
  };

  return (
    <div>
      <h5 style={{ color: 'grey', marginLeft: '3px' }}>
        <Translate id="voting.specialtyHeadline" />
      </h5>
      <Dropdown
        fluid
        multiple
        selection
        search
        options={specialer[props.question.semester]}
        value={chosenSpecialties}
        onChange={onChangeSpecialties}
      />
      <Divider hidden />
      <Button basic color="green" onClick={specialtyVote}>
        Stem på specialer
      </Button>
      {specialtyMessage && <Message color="green">{specialtyMessage}</Message>}
      <Divider />
      <h5 style={{ color: 'grey', marginLeft: '3px' }}>
        <Translate id="voting.tagsHeadline" />
      </h5>
      <Dropdown
        fluid
        multiple
        selection
        search
        options={tags[props.question.semester]}
        value={chosenTags}
        onChange={onChangeTags}
      />
      <Divider hidden />
      <Button basic color="green" onClick={tagVote}>
        Stem på tags
      </Button>
      {!addingNewTag && (
        <Button basic color="yellow" onClick={onAddingNewTag}>
          Foreslå nyt tag
        </Button>
      )}
      {addingNewTag && (
        <div>
          <Divider hidden />
          <Input width={5} placeholder="Tag ..." value={newTag} onChange={handleNewTag} />
          <Button basic color="green" onClick={suggestTag}>
            Foreslå tag
          </Button>
        </div>
      )}
      {tagMessage && <Message color="green">{tagMessage}</Message>}
      <Divider hidden />
      <p style={{ color: 'grey' }}>
        <Translate id="voting.notice" />
      </p>
    </div>
  );
};

QuestionVoting.propTypes = {
  voteSpecialty: PropTypes.func,
  user: PropTypes.object,
  question: PropTypes.object,
  voteTags: PropTypes.func,
  questionReport: PropTypes.func
};

export default connect(
  null,
  actions
)(QuestionVoting);
