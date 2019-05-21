import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { PropTypes } from 'prop-types';

const QuestionAnsweredCounter = (props) => {
  // Udregner hvor mange rigtige brugeren har svaret på
  const { question, user } = props;

  if (!user.answeredQuestions) return null;
  const answered = user.answeredQuestions;

  if (
    !answered ||
    !answered[question.semester] ||
    !answered[question.semester][String(question._id)]
  )
    return null;

  const { correct, wrong } = answered[question.semester][String(question._id)];
  return (
    <Grid.Column textAlign="right" floated="right" width="5">
      {/* En ret verbose måde at udregne besvarede spørgsmål på, men det fungerer. Muligvis lidt refactor er nyttigt, men jeg har ikke kunnet regne en bedre måde ud, en alle de IFs. */}
      <Grid.Row>
        <Translate
          id="questionMetadata.answered"
          data={{
            correct,
            wrong: correct + wrong,
            percent: Math.round((correct / (wrong + correct)) * 100)
          }}
        />
      </Grid.Row>
    </Grid.Column>
  );
};

QuestionAnsweredCounter.propTypes = {
  user: PropTypes.object,
  question: PropTypes.object
};

export default QuestionAnsweredCounter;
