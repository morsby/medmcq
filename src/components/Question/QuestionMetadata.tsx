import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { isAnswered } from 'utils/quiz';
import CopyToClipBoard from 'react-copy-to-clipboard';

import { Grid, Button, Input, Message, Icon, Loader } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import QuestionMetadataLabel from './QuestionMetadata/QuestionMetadataLabel';
import QuestionMetadataDropdown from './QuestionMetadata/QuestionMetadataDropdown';
import makeToast from 'redux/actions/makeToast';
import { ReduxState } from 'redux/reducers';
import Metadata from 'classes/Metadata';
import User from 'classes/User';
import Tag from 'classes/Tag';
import questionsReducer from 'redux/reducers/question';
import Question from 'classes/Question';
import QuestionHadHelpLabel from './QuestionMetadata/QuestionHadHelpLabel';
import Semester from 'classes/Semester';
import LoadingPage from 'components/Misc/Utility/LoadingPage';

export interface QuestionMetadataProps {}

const QuestionMetadata: React.SFC<QuestionMetadataProps> = () => {
  const dispatch = useDispatch();
  const [newTag, setNewTag] = useState('');
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [suggestTagMessage, setSuggestTagMessage] = useState('');
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const isEditing = useSelector((state: ReduxState) => state.questions.isEditing);
  const semesterId = question.examSet.semester.id;
  const examSet = useSelector((state: ReduxState) =>
    state.metadata.semesters
      .flatMap((s) => s.examSets)
      .find((examSet) => examSet.id === question.examSet.id)
  );
  const specialties = useSelector(
    (state: ReduxState) =>
      state.metadata.semesters.find((semester) => semester.id === semesterId)?.specialties
  );
  const answers = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.filter((ua) => question.answers.some((a) => a.id === ua.answerId))
  );
  const specialtyVotes = question.specialtyVotes;
  const tagVotes = question.tagVotes;
  const tags = useSelector(
    (state: ReduxState) =>
      state.metadata.semesters.find((semester) => semester.id === semesterId)?.tags
  );
  const user = useSelector((state: ReduxState) => state.auth.user);
  const [addingTagError, setAddingTagError] = useState('');

  const metadataVote = async (type: 'specialty' | 'tag', metadataId: number) => {
    await Metadata.vote({ type, questionId: question.id, metadataId, vote: 1 });
  };

  useEffect(() => {
    setSuggestTagMessage('');
    setAddingTagError('');
    Semester.fetchAll();
  }, [question]);

  const suggestTag = async () => {
    if (tags.some((t) => t.name.toLowerCase() === newTag.trim().toLowerCase())) {
      return setAddingTagError('Tagget eksisterer allerede. Vælg det under menuen "+ Tilføj tag".');
    }
    if (newTag.trim().length === 0) {
      return setAddingTagError('Du skal angive et navn på det tag du foreslår.');
    }
    setAddingTagError('');
    await Tag.suggest({ tagName: newTag, questionId: question.id });
    setNewTag('');
    setAddingNewTag(false);
    setSuggestTagMessage('Dit tag er blevet foreslået');
  };

  const handleChange = (e: any, { value }: { value: string }) => {
    setNewTag(value);
  };

  const handleBookmark = async () => {
    setIsBookmarking(true);
    await User.bookmark({ questionId: question.id });
    setIsBookmarking(false);
  };

  const handleIgnore = async () => {
    setIsIgnoring(true);
    await Question.ignore(question.id);
    setIsIgnoring(false);
  };

  if (!examSet) return <LoadingPage />;
  return (
    <Grid celled stackable columns="equal">
      <Grid.Column>
        <Grid.Row>
          <div>
            <Translate id="questionMetadata.set" />{' '}
            {examSet.season === 'F' ? (
              <Translate id="questionMetadata.set_season.F" />
            ) : (
              <Translate id="questionMetadata.set_season.E" />
            )}{' '}
            {examSet.year} <QuestionHadHelpLabel hadHelp={examSet.hadHelp} />
          </div>
          {question.user && (
            <div>
              <p>Lavet af: {question.user.username.toTitleCase()}</p>
            </div>
          )}
        </Grid.Row>
        {isAnswered(question, answers) && (
          <>
            <Grid.Row style={{ margin: '7px 0 7px 0' }}>
              <Translate id="questionMetadata.specialty" />{' '}
              {_(question.specialties)
                .orderBy('votes', 'desc')
                .map((s) => specialties.find((specialty) => specialty.id === s.id))
                .map((specialty) => {
                  if (!specialty) return null;
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
                .orderBy('votes', 'desc')
                .map((t) => {
                  if (!t) return null;
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
          {user && (question.user?.id === user.id || user?.role.id === 1) && (
            <Button
              onClick={() => dispatch(questionsReducer.actions.toggleEditing())}
              basic
              color="orange"
            >
              {isEditing ? 'Luk redigering' : 'Rediger'}
            </Button>
          )}
          {user && isAnswered(question, answers) && <QuestionAnsweredCounter />}
        </Grid.Row>
      </Grid.Column>
      {user && isAnswered(question, answers) && (
        <Grid.Row verticalAlign="middle">
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
                  error={!!addingTagError}
                />
                <Button basic color="green" onClick={suggestTag}>
                  <Translate id="voting.suggest_tag" />
                </Button>
                <Button basic color="red" onClick={() => setAddingNewTag(false)}>
                  <Translate id="voting.cancel" />
                </Button>
              </>
            )}
            {addingTagError && <Message color="red">{addingTagError}</Message>}
            {suggestTagMessage && <Message color="green">{suggestTagMessage}</Message>}
          </Grid.Column>
          <Grid.Column width={5} textAlign="right">
            <div>
              <span style={{ color: 'grey' }}>Gem spørgsmål - </span>
              {isBookmarking ? (
                <Loader active inline size="small" />
              ) : (
                <Icon
                  style={{ cursor: 'pointer' }}
                  onClick={handleBookmark}
                  color={
                    user.bookmarks.find((bookmark) => bookmark.question.id === question.id)
                      ? 'green'
                      : 'grey'
                  }
                  name="flag"
                  size="large"
                />
              )}
            </div>
            <div style={{ height: '5px' }} />
            <div>
              <span style={{ color: 'grey' }}>Vis mig ikke spørgsmålet igen - </span>
              {isIgnoring ? (
                <Loader active inline size="small" />
              ) : (
                <Icon
                  style={{ cursor: 'pointer' }}
                  onClick={handleIgnore}
                  color={question.isIgnored ? 'red' : 'grey'}
                  name="close"
                  size="large"
                />
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

export default QuestionMetadata;
