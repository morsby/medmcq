import React from 'react';

import { urls, truncateText } from '../../utils/common';
import { calculateResults } from '../../utils/quiz';

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
  const answers = useSelector((state: ReduxState) => state.quiz.answers);
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const usedExamTime = useSelector((state: ReduxState) => state.quiz.usedExamTime);
  let results = calculateResults(questions, answers);

  return (
    <Container>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Translate id="quizSummary.header" />
          </Card.Header>
          {results.status && !examMode && (
            <Card.Content>
              <Translate id="quizSummary.results" data={{ ...results }} />
              <br />
              {usedExamTime && <Translate id="quizSummary.usedTime" data={{ usedExamTime }} />}
            </Card.Content>
          )}
          <Card.Description style={{ columns: '250px 4' }}>
            <List ordered>
              {questions.map((q, index) => {
                const answer = answers.find((answer) => answer.questionId === q.id)?.answer;

                let userAnswer: string;
                if (answer) {
                  if (examMode) {
                    userAnswer = 'svar-examMode';
                  } else if (q.correctAnswers.includes(answer)) {
                    userAnswer = 'svar-korrekt';
                  } else if (!q.correctAnswers.includes(answer)) {
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
