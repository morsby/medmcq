import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import * as actions from 'actions/index';
import _ from 'lodash';
import { isAnswered } from 'utils/quiz';
import CopyToClipBoard from 'react-copy-to-clipboard';

import { Grid, Button, Input, Message, Icon } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import QuestionMetadataLabel from './QuestionMetadata/QuestionMetadataLabel';
import QuestionMetadataDropdown from './QuestionMetadata/QuestionMetadataDropdown';
import { withRouter } from 'react-router';
import { makeToast } from 'actions/index';

const QuestionMetadata = (props) => {
  const dispatch = useDispatch();
  const { question, user, metadata } = props;
  const [newTag, setNewTag] = useState('');
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [suggestTagMessage, setSuggestTagMessage] = useState('');

  const metadataVote = async (type, metadataId) => {
    await props.voteAction(type, question.id, metadataId, 1);
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
  specialties = _.pickBy(specialties, (s) => s.semesterId === question.examSet.semester);
  tags = _.pickBy(tags, (t) => t.semesterId === question.semester);
  console.log(question);
  let examSet = metadata.entities.examSets[question.examSet];
  return (
    <Grid celled stackable columns="equal">
      <Grid.Column>
        <Grid.Row>
          <Translate id="questionMetadata.set" />{' '}
          {examSet.season === 'F' ? (
            <Translate id="questionMetadata.set_season.F" />
          ) : (
            <Translate id="questionMetadata.set_season.E" />
          )}{' '}
          {examSet.year}
        </Grid.Row>
        {isAnswered(question) && (
          <>
            <Grid.Row style={{ margin: '7px 0 7px 0' }}>
              <Translate id="questionMetadata.specialty" />{' '}
              {_.orderBy(question.specialties, 'votes', 'desc').map((s) => {
                let spec = specialties[s.specialtyId] || {};
                return (
                  <QuestionMetadataLabel
                    key={spec.id}
                    metadata={spec}
                    user={user}
                    question={question}
                    type="specialty"
                  >
                    {spec.name}
                  </QuestionMetadataLabel>
                );
              })}
              {user && (
                <QuestionMetadataDropdown
                  type="specialty"
                  text="Speciale"
                  onChange={(value) => metadataVote('specialty', value)}
                  options={specialties}
                />
              )}
            </Grid.Row>
            <Grid.Row>
              <Translate id="questionMetadata.tags" />{' '}
              {_(question.tags)
                .map((t) => tags[t.tagId])
                .filter((t) => !!t.parent.id)
                .orderBy('votes', 'desc')
                .map((t) => {
                  return (
                    <QuestionMetadataLabel
                      type="tag"
                      key={t.id}
                      metadata={t}
                      user={user}
                      question={question}
                    >
                      {t.name}
                    </QuestionMetadataLabel>
                  );
                })
                .value()}
              {user && (
                <QuestionMetadataDropdown
                  type="tag"
                  text="Tag"
                  onChange={(value) => metadataVote('tag', value)}
                  options={tags}
                />
              )}
            </Grid.Row>
          </>
        )}
      </Grid.Column>
      <Grid.Column width={5} style={{ textAlign: 'right' }}>
        <Grid.Row style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <CopyToClipBoard
            text={`${window.location.href.split(/\/quiz/)[0]}/quiz/${question.id}`}
            onCopy={() => dispatch(makeToast('toast.share', 'success'))}
          >
            <Button basic color="blue">
              <Translate id="voting.share" />
            </Button>
          </CopyToClipBoard>
          {user && isAnswered(question) && (
            <QuestionAnsweredCounter user={user} question={question} />
          )}
        </Grid.Row>
      </Grid.Column>
      {user && isAnswered(question) && (
        <>
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
            <Grid.Column width={5} textAlign="right">
              <span style={{ color: 'grey' }}>Gem spørgsmål - </span>
              <Icon
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (question.isBookmarked) {
                    dispatch(actions.removeBookmark(question.id));
                  } else {
                    dispatch(actions.createBookmark(question.id));
                  }
                }}
                color={question.isBookmarked ? 'green' : 'grey'}
                name="flag"
                size="large"
              />
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
  // New props
  metadata: PropTypes.object,
  voteAction: PropTypes.func
};

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(QuestionMetadata)
);
