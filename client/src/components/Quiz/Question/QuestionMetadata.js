import React from 'react';
import { Translate } from 'react-localize-redux';
import { Grid, Label, Icon } from 'semantic-ui-react';
import QuestionAnsweredCounter from './QuestionMetadata/QuestionAnsweredCounter';
import _ from 'lodash';
import { PropTypes } from 'prop-types';

const QuestionMetadata = (props) => {
  const { question, user, specialer, tags } = props;

  const deleteTag = (value) => {
    console.log(question._id, value);
  };

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
                .map((spec) => _.find(specialer[question.semester], { value: spec }) || {})
                .map((spec) => (
                  <Label key={spec.value} style={{ marginTop: '2px' }} size="small">
                    {spec.text} <Icon onClick={() => deleteTag(spec.value)} name="delete" />
                  </Label>
                ))}
            </Grid.Row>
            <Grid.Row>
              <Translate id="questionMetadata.tags" />{' '}
              {_.filter(
                question.tags.map((tag) => _.find(tags[question.semester], { value: tag }) || {}),
                (t) => {
                  return t;
                }
              ).map((tag) => (
                <Label key={tag.value} style={{ marginTop: '2px' }} size="small">
                  {tag.text} <Icon onClick={() => deleteTag(tag.value)} name="delete" />
                </Label>
              ))}
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
