import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface QuestionAnsweredCounterProps {}

// Udregner hvor mange rigtige brugeren har svaret på
const QuestionAnsweredCounter: React.SFC<QuestionAnsweredCounterProps> = () => {
  return null; // TODO
  return (
    <Grid.Column textAlign="right" floated="right" width="5">
      {/* En ret verbose måde at udregne besvarede spørgsmål på, men det fungerer. Muligvis lidt refactor er nyttigt, men jeg har ikke kunnet regne en bedre måde ud, en alle de IFs. */}
      <Grid.Row>
        <Translate id="questionMetadata.answered" data={{}} />
      </Grid.Row>
    </Grid.Column>
  );
};

export default QuestionAnsweredCounter;
