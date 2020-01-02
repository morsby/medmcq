import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { isAnswered } from 'utils/quiz';
import CopyToClipBoard from 'react-copy-to-clipboard';

import { Grid, Button, Input, Message, Icon } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import QuestionMetadataLabel from './QuestionMetadata/QuestionMetadataLabel';
import QuestionMetadataDropdown from './QuestionMetadata/QuestionMetadataDropdown';
import makeToast from 'redux/actions/makeToast';
import { ReduxState } from 'redux/reducers';
import Metadata from 'classes/Metadata';
import User from 'classes/User';
import Tag from 'classes/Tag';

export interface QuestionMetadataProps {}

const QuestionMetadata: React.SFC<QuestionMetadataProps> = () => {
  const dispatch = useDispatch();
  const [newTag, setNewTag] = useState('');
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [suggestTagMessage, setSuggestTagMessage] = useState('');
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const semesterId = question.examSet.semester.id;
  const examSet = useSelector((state: ReduxState) =>
    state.metadata.semesters
      .find((semester) => semester.id === semesterId)
      .examSets.find((examSet) => examSet.id === question.examSet.id)
  );
  const specialties = useSelector(
    (state: ReduxState) =>
      state.metadata.semesters.find((semester) => semester.id === semesterId).specialties
  );
  const specialtyVotes = question.specialtyVotes;
  const tagVotes = question.tagVotes;
  const tags = useSelector(
    (state: ReduxState) =>
      state.metadata.semesters.find((semester) => semester.id === semesterId).tags
  );
  const user = useSelector((state: ReduxState) => state.auth.user);

  const metadataVote = async (type, metadataId) => {
    await Metadata.vote({ type, questionId: question.id, metadataId, vote: 1 });
  };

  useEffect(() => {
    setSuggestTagMessage('');
  }, [question]);

  const suggestTag = async () => {
    await Tag.suggest({ tagName: newTag, questionId: question.id });
    setNewTag('');
    setAddingNewTag(false);
    setSuggestTagMessage('Dit tag er blevet foreslået');
  };

  const handleChange = (e, { value }) => {
    setNewTag(value);
  };

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
              {_(question.specialties)
                .orderBy('votes', 'desc')
                .map((s) => specialties.find((specialty) => specialty.id === s.id))
                .map((specialty) => {
                  const questionSpecialtyVotes = specialtyVotes.filter(
                    (s) => s.specialty.id === specialty.id
                  );
                  const votes = _.sumBy(questionSpecialtyVotes, (sv) => sv.vote);

                  return (
                    <QuestionMetadataLabel
                      key={specialty.id}
                      metadata={specialty}
                      voteCount={votes}
                      metadataVotes={questionSpecialtyVotes}
                      type="specialty"
                    >
                      {specialty.name}
                    </QuestionMetadataLabel>
                  );
                })
                .value()}
              {user && (
                <QuestionMetadataDropdown
                  type="specialty"
                  onChange={(value) => metadataVote('specialty', value)}
                />
              )}
            </Grid.Row>
            <Grid.Row>
              <Translate id="questionMetadata.tags" />{' '}
              {_(question.tags)
                .map((t) => tags.find((tag) => tag.id === t.id))
                .filter((t) => !!t.parent.id)
                .orderBy('votes', 'desc')
                .map((t) => {
                  const questionTagVotes = tagVotes.filter((tv) => tv.tag.id === t.id);
                  const votes = _.sumBy(questionTagVotes, (tv) => tv.vote);

                  return (
                    <QuestionMetadataLabel
                      type="tag"
                      key={t.id}
                      metadata={t}
                      voteCount={votes}
                      metadataVotes={questionTagVotes}
                    >
                      {t.name}
                    </QuestionMetadataLabel>
                  );
                })
                .value()}
              {user && (
                <QuestionMetadataDropdown
                  type="tag"
                  onChange={(value) => metadataVote('tag', value)}
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
          {user && isAnswered(question) && <QuestionAnsweredCounter />}
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
                    onChange={handleChange}
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
                    User.bookmark({ questionId: question.id });
                  } else {
                    User.bookmark({ questionId: question.id });
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

export default QuestionMetadata;
