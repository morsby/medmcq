import React from 'react';
import PropTypes from 'prop-types';

import { urls, truncateText } from '../../utils/common';
import { calculateResults } from '../../utils/quiz';

import { Card, List, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-localize-redux';

/**
 * Viser et overblik over alle spørgsmål i quizzen og fremgangen.
 *
 * Alle props er fra Quiz.js
 * @param {array}   questions    Indeholder alle spørgsmålene.
 * @param {func}    clickHandler Funktion der navigerer til det klikkede spg.
 */

const QuizSummary = ({ questions, clickHandler }) => {
  let results = calculateResults(questions);

  return (
    <Container>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Translate id="quizSummary.header" />
          </Card.Header>
          {results.status && (
            <Card.Content>
              <Translate id="quizSummary.results" data={{ ...results }} />
            </Card.Content>
          )}
          <Card.Description style={{ columns: '250px 4' }}>
            <List ordered>
              {questions.result.map((qId, index) => {
                let q = questions.entities.questions[qId];
                let svar;
                if (q.correctAnswers.includes(q.answer)) {
                  svar = 'svar-korrekt';
                } else if (q.answer && !q.correctAnswers.includes(q.answer)) {
                  svar = 'svar-forkert';
                }
                return (
                  <List.Item as="a" className={svar} onClick={() => clickHandler(index)} key={q.id}>
                    {truncateText(q.text)}
                  </List.Item>
                );
              })}
            </List>
          </Card.Description>
        </Card.Content>
        <Card.Content extra textAlign="center">
          <Link to={urls.print}>
            <Button basic>
              <Translate id="quizSummary.print" />
            </Button>
          </Link>
        </Card.Content>
      </Card>
    </Container>
  );
};

QuizSummary.propTypes = {
  questions: PropTypes.object.isRequired,
  clickHandler: PropTypes.func.isRequired
};

export default QuizSummary;
