import React from 'react';
import { Translate } from 'react-localize-redux';
import { Grid } from 'semantic-ui-react';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

const QuestionMetadata = (props) => {
  const { question, user, specialer, tags } = props;

  return (
    <Grid divided columns="equal">
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
              {question.specialty
                .map((spec) => (_.find(specialer[question.semester], { value: spec }) || {}).text)
                .join(' | ')}
            </Grid.Row>
            <Grid.Row>
              <Translate id="questionMetadata.tags" />{' '}
              {_.filter(
                question.tags.map(
                  (tag) => (_.find(tags[question.semester], { value: tag }) || {}).text
                ),
                (t) => {
                  return t;
                }
              ).join(' | ')}
            </Grid.Row>
          </>
        )}
      </Grid.Column>
      {user && question.answer && <QuestionAnsweredCounter user={user} question={question} />}
    </Grid>
  );
};

QuestionMetadata.propTypes = {
  question: PropTypes.object,
  user: PropTypes.object,
  specialer: PropTypes.object,
  tags: PropTypes.object
};

export default QuestionMetadata;
