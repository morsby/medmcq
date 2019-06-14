import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { Grid, Button, Input, Message } from 'semantic-ui-react';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import { PropTypes } from 'prop-types';
import QuestionMetadataLabel from './QuestionMetadata/QuestionMetadataLabel';
import { connect } from 'react-redux';
import * as actions from 'actions/index';
import { withRouter } from 'react-router';
import _ from 'lodash';
import QuestionMetadataDropdown from './QuestionMetadata/QuestionMetadataDropdown';

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
      let { tags, specialties } = question;
      if (!tags || !specialties) return;
      specialties = _.sortBy(specialties, (s) => s.text);
      tags = _.sortBy(tags, (t) => t.text);

      // Filter the specialty array, so that you can't vote for existing specialties
      let spliceArray = [];

      specialties.forEach((spec, i) => {
        question.specialties.forEach((s) => {
          if (spec._id === s.specialtyId) {
            spliceArray.push(i);
          }
        });
      });

      for (let i = spliceArray.length - 1; i >= 0; i--) {
        specialties.splice(spliceArray[i], 1);
      }

      // Do the same with tags
      spliceArray = [];

      tags.forEach((tag, i) => {
        question.tags.forEach((t) => {
          if (tag.tagId === t.tagId) {
            spliceArray.push(i);
          }
        });
      });

      for (let i = spliceArray.length - 1; i >= 0; i--) {
        tags.splice(spliceArray[i], 1);
      }

      setSpecialties(specialties);
      setTags(tags);
    };

    getMetadata();
    setSuggestTagMessage('');
  }, [question, props.metadata]);

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
    <Grid celled stackable columns="equal">
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
            <Grid.Row style={{ margin: '7px 0 7px 0' }}>
              <Translate id="questionMetadata.specialty" />{' '}
              {question.specialties.map((spec) => (
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
                <QuestionMetadataDropdown
                  type="specialty"
                  text="Speciale"
                  onChange={(value) => newMetadata('specialty', value)}
                  options={specialties}
                />
              )}
            </Grid.Row>
            <Grid.Row>
              <Translate id="questionMetadata.tags" />{' '}
              {question.tags.map((tag) => (
                <QuestionMetadataLabel
                  type="tag"
                  key={tag.tagId}
                  metadata={tag}
                  user={user}
                  question={question}
                >
                  {tag.tag.text}
                </QuestionMetadataLabel>
              ))}
              {user && (
                <QuestionMetadataDropdown
                  type="tag"
                  text="Tag"
                  onChange={(value) => newMetadata('tag', value)}
                  options={tags}
                />
              )}
            </Grid.Row>
          </>
        )}
      </Grid.Column>
      {user && question.answer && (
        <>
          <Grid.Column width={5} style={{ textAlign: 'right' }}>
            <Grid.Row>
              <QuestionAnsweredCounter user={user} question={question} />
            </Grid.Row>
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
  tags: PropTypes.object,
  questionReport: PropTypes.func,

  // Probably delete/change:
  metadata: PropTypes.object,
  newMetadata: PropTypes.func
};

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(QuestionMetadata)
);
