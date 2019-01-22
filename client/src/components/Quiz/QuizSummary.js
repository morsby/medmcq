import React from 'react';
import PropTypes from 'prop-types';

import { urls, truncateText } from '../../utils/common';
import { calculateResults } from '../../utils/quiz';

import { Card, List, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const QuizSummary = ({ questions, answers, clickHandler }) => {
    let results = calculateResults(answers, questions.length);

    return (
        <Container>
            <Card fluid>
                <Card.Content>
                    <Card.Header>Fremgang</Card.Header>
                    {results.done && (
                        <Card.Content>
                            Du svarede rigtigt på {results.correct} af{' '}
                            {results.n} spørgsmål. Det svarer til{' '}
                            {results.percentage}
                        </Card.Content>
                    )}
                    <Card.Description style={{ columns: '250px 4' }}>
                        <List ordered>
                            {questions.map((q, index) => {
                                let svar;
                                if (
                                    q.answer &&
                                    (q.answer === q.correctAnswer ||
                                        (Array.isArray(q.correctAnswer) &&
                                            q.correctAnswer.includes(q.answer)))
                                ) {
                                    svar = 'svar-korrekt';
                                } else if (
                                    q.answer &&
                                    q.answer !== q.correctAnswer
                                ) {
                                    svar = 'svar-forkert';
                                }
                                return (
                                    <List.Item
                                        as="a"
                                        className={svar}
                                        onClick={() => clickHandler(index)}
                                        key={q._id}
                                    >
                                        {truncateText(q.question)}
                                    </List.Item>
                                );
                            })}
                        </List>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra textAlign="center">
                    <Link to={urls.print}>
                        <Button basic>Print disse spørgsmål</Button>
                    </Link>
                </Card.Content>
            </Card>
        </Container>
    );
};

QuizSummary.propTypes = {
    questions: PropTypes.array.isRequired,
    answers: PropTypes.array.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default QuizSummary;
