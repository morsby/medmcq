import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import _ from 'lodash';

import { specialer, tags } from '../../../utils/common';

import { Button, Message, Input, Grid } from 'semantic-ui-react';
import { Divider, Dropdown } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router';

const QuestionVoting = (props) => {
  const [chosenTags, setChosenTags] = useState([]);
  const [chosenSpecialties, setChosenSpecialties] = useState([]);
  const [tagMessage, setTagMessage] = useState('');
  const [specialtyMessage, setSpecialtyMessage] = useState('');
  const [newTag, setNewTag] = useState('');
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [suggestTagMessage, setSuggestTagMessage] = useState('');

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
    setSuggestTagMessage('');
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

  const handleNewTag = (e, { value }) => {
    setNewTag(value);
  };

  const suggestTag = () => {
    props.questionReport({
      type: 'suggest_tag',
      data: {
        tag: newTag,
        question: props.question
      }
    });
    setNewTag('');
    setAddingNewTag(false);
    setSuggestTagMessage('Dit tag er blevet foreslået');
  };

  return (
    <div>
      <Grid stackable divided columns="equal">
        <Grid.Row>
          <Grid.Column>
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
              <Translate id="voting.vote_specialty" />
            </Button>
            {specialtyMessage && <Message color="green">{specialtyMessage}</Message>}
          </Grid.Column>
          <Grid.Column>
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
              <Translate id="voting.vote_tags" />
            </Button>
            {!addingNewTag && (
              <Button basic color="yellow" onClick={() => setAddingNewTag(true)}>
                <Translate id="voting.suggest_tag" />
              </Button>
            )}
            {addingNewTag && (
              <div>
                <Divider hidden />
                <Input
                  style={{ marginRight: '1rem' }}
                  width={5}
                  placeholder="Tag ..."
                  value={newTag}
                  onChange={handleNewTag}
                />
                <Button basic color="green" onClick={suggestTag}>
                  <Translate id="voting.suggest_tag" />
                </Button>
                <Button basic color="red" onClick={() => setAddingNewTag(false)}>
                  <Translate id="voting.cancel" />
                </Button>
              </div>
            )}
            {suggestTagMessage && <Message color="green">{suggestTagMessage}</Message>}
            {tagMessage && <Message color="green">{tagMessage}</Message>}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column align="center">
            <p style={{ color: 'grey' }}>
              <Translate id="voting.notice" />
              <span
                style={{ cursor: 'pointer', color: '#4183c4' }}
                onClick={() => props.history.push('/om-siden')}
              >
                <Translate id="voting.about_page" />
              </span>
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

QuestionVoting.propTypes = {
  voteSpecialty: PropTypes.func,
  user: PropTypes.object,
  question: PropTypes.object,
  voteTags: PropTypes.func,
  questionReport: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(
  connect(
    null,
    actions
  )(QuestionVoting)
);
