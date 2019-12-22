import React from 'react';
import PropTypes from 'prop-types';

import { urls, truncateText } from '../../utils/common';
import { calculateResults, isAnswered } from '../../utils/quiz';

import { Card, List, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

/**
 * Viser et overblik over alle spørgsmål i quizzen og fremgangen.
 *
 * Alle props er fra Quiz.js
 * @param {array}   questions    Indeholder alle spørgsmålene.
 * @param {func}    clickHandler Funktion der navigerer til det klikkede spg.
 */
export interface QuizSummaryProps {
  clickHandler: Function;
}

const QuizSummary: React.SFC<QuizSummaryProps> = ({ clickHandler }) => {
  const questions = useSelector((state: ReduxState) => state.questions.questions);
  const questionIds = useSelector((state: ReduxState) => state.quiz.questionIds);
  const answers = useSelector((state: ReduxState) => state.quiz.answers);
  let results = calculateResults(questions, answers);

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
              {questionIds.map((qId, index) => {
                const q = questions.find((question) => question.id === qId);

                let userAnswer;
                if (isAnswered(q)) {
                  if (
                    q.correctAnswers.includes(answers.find((answer) => answer.questionId).answer)
                  ) {
                    userAnswer = 'svar-korrekt';
                  } else if (
                    !q.correctAnswers.includes(answers.find((answer) => answer.questionId).answer)
                  ) {
                    userAnswer = 'svar-forkert';
                  }
                }

                return (
                  <List.Item
                    as="a"
                    className={userAnswer}
                    onClick={() => clickHandler(index)}
                    key={q.id}
                  >
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

export default QuizSummary;
