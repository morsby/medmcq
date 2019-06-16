import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'actions/index';
import { isAnswered } from 'utils/quiz';

import { Grid, Button, Input, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import QuestionMetadataLabel from './QuestionMetadata/QuestionMetadataLabel';
import QuestionMetadataDropdown from './QuestionMetadata/QuestionMetadataDropdown';

const QuestionMetadata = (props) => {
  const { question, user, metadata } = props;
  const [newTag, setNewTag] = useState('');
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [suggestTagMessage, setSuggestTagMessage] = useState('');

  const newMetadata = async (type, value) => {
    await props.newMetadata(type, value, question._id, user._id);
  };

  useEffect(() => {
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

  let { tags, specialties } = metadata.entities;
  tags = [];
  specialties = [];
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
        {isAnswered(question) && (
          <>
            <Grid.Row style={{ margin: '7px 0 7px 0' }}>
              <Translate id="questionMetadata.specialty" />{' '}
              {question.specialties.map((spec) => (
                <QuestionMetadataLabel
                  key={spec.specialtyId}
                  metadata={spec}
                  user={user}
                  question={question}
                  type="specialty"
                >
                  {spec.specialtyName}
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
                  {tag.tagName}
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
      {user && isAnswered(question) && (
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
    metadata: state.metadata,

    // bruges kun til at opdatere på besvarelse
    answers: state.quiz.answers
  };
};

QuestionMetadata.propTypes = {
  question: PropTypes.object,
  user: PropTypes.object,
  questionReport: PropTypes.func,
  newMetadata: PropTypes.func,
  // New props
  metadata: PropTypes.object
};

export default connect(
  mapStateToProps,
  actions
)(QuestionMetadata);
