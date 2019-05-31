import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { Grid, Dropdown, Button, Divider, Input, Message } from 'semantic-ui-react';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import { PropTypes } from 'prop-types';
import QuestionMetadataLabel from './QuestionMetadata/QuestionMetadataLabel';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../../actions/questions';
import { withRouter } from 'react-router';
import _ from 'lodash';

const QuestionMetadata = (props) => {
  const { question, user } = props;
  const [specialties, setSpecialties] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [suggestTagMessage, setSuggestTagMessage] = useState('');

  const newMetadata = async (type, value) => {
    await props.newMetadata(type, value, question._id, user._id);
  };

  useEffect(() => {
    const getMetadata = async () => {
      let { tags, specialties } = props.metadata;
      if (!tags || !specialties) return;
      specialties = _.sortBy(specialties, (s) => s.text);
      tags = _.sortBy(tags, (t) => t.text);

      // Filter the specialty array, so that you can't vote for existing specialties
      let spliceArray = [];

      specialties.forEach((spec, i) => {
        question.newSpecialties.forEach((s) => {
          if (spec._id === s.specialty._id) {
            spliceArray.push(i);
          }
        });
      });

      spliceArray.forEach((value) => {
        specialties.splice(value, 1);
      });

      // Do the same with tags
      spliceArray = [];

      tags.forEach((tag, i) => {
        question.newTags.forEach((t, k) => {
          if (tag._id === t.tag._id) {
            spliceArray.push(i);
          }
        });
      });

      spliceArray.forEach((value) => {
        tags.splice(value, 1);
      });

      setSpecialties(specialties);
      setTags(tags);
    };

    getMetadata();
  }, [question]);

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

  const handleNewTag = (e, { value }) => {
    setNewTag(value);
  };

  return (
    <Grid celled="internally" stackable columns="equal">
      <Grid.Column>
        <Grid.Row>
          <Translate id="questionMetadata.set" />{' '}
          {question.examSeason === 'F' ? (
            <Translate id="questionMetadata.set_season.F" />
          ) : (
            <Translate id="questionMetadata.set_season.E" />
          )}{' '}
          {question.examYear}
        </Grid.Row>
        {question.answer && (
          <>
            <Grid.Row>
              <Translate id="questionMetadata.specialty" />{' '}
              {question.newSpecialties.map((spec) => (
                <QuestionMetadataLabel
                  key={spec._id}
                  metadata={spec}
                  user={user}
                  question={question}
                  type="specialty"
                >
                  {spec.specialty.text}
                </QuestionMetadataLabel>
              ))}
              {user && (
                <Dropdown
                  style={{ margin: '3px' }}
                  search
                  selection
                  onChange={(e, { value }) => newMetadata('specialty', value)}
                  options={specialties}
                  value=""
                />
              )}
            </Grid.Row>
            <Grid.Row>
              <Translate id="questionMetadata.tags" />{' '}
              {question.newTags.map((tag) => (
                <QuestionMetadataLabel
                  type="tag"
                  key={tag._id}
                  metadata={tag}
                  user={user}
                  question={question}
                >
                  {tag.tag.text}
                </QuestionMetadataLabel>
              ))}
              {user && (
                <Dropdown
                  style={{ margin: '3px' }}
                  search
                  onChange={(e, { value }) => newMetadata('tag', value)}
                  selection
                  options={tags}
                  value=""
                />
              )}
            </Grid.Row>
          </>
        )}
      </Grid.Column>
      {user && question.answer && (
        <>
          <Grid.Column width={5} style={{ textAlign: 'right' }}>
            <QuestionAnsweredCounter user={user} question={question} />
          </Grid.Column>
          <Grid.Row>
            <Grid.Column>
              {!addingNewTag && (
                <Button basic color="yellow" onClick={() => setAddingNewTag(true)}>
                  <Translate id="voting.suggest_tag" />
                </Button>
              )}
              {addingNewTag && (
                <>
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
                </>
              )}
              {suggestTagMessage && <Message color="green">{suggestTagMessage}</Message>}
            </Grid.Column>
          </Grid.Row>
        </>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    metadata: state.settings.metadata
  };
};

QuestionMetadata.propTypes = {
  question: PropTypes.object,
  user: PropTypes.object,
  specialer: PropTypes.object,
  tags: PropTypes.object
};

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(QuestionMetadata)
);
