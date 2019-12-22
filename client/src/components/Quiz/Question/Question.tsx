import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import marked from 'marked';

import _ from 'lodash';
import { imageURL, breakpoints } from 'utils/common';

import { subSupScript } from 'utils/quiz';

import { Container, Grid, Divider, Segment, Responsive } from 'semantic-ui-react';

import QuestionAnswerButtons from 'components/Quiz/Question/QuestionAnswerButtons';
import QuestionImage from 'components/Quiz/Question/QuestionImage';
import QuestionMetadata from 'components/Quiz/Question/QuestionMetadata';
import QuestionExtras from 'components/Quiz/Question/QuestionExtras';
import { ReduxState } from 'redux/reducers/index';
import Quiz from 'classes/Quiz';

/**
 * Component ansvarlig for at vise selve spørgsmålet, evt. billeder, kommentarer
 * og svar.
 */
export interface QuestionProps {}

const Question: React.SFC<QuestionProps> = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [answerTime, setAnswerTime] = useState(0);
  const currentQuestionNumber = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionNumber]
  );
  const answer = useSelector((state: ReduxState) =>
    state.quiz.answers.find((answer) => answer.questionId === question.id)
  );
  const imgOpen = useSelector((state: ReduxState) => state.quiz.imgOpen);

  useEffect(() => {
    setAnswerTime(0);
  }, [question]);

  const handleAnswer = (answer: number) => {
    Quiz.answer({ answer, answerTime, questionId: question.id });
  };

  useEffect(() => {
    let handleResize = () => setWidth(window.innerWidth);
    handleResize = _.debounce(handleResize, 300);

    window.addEventListener('resize', handleResize);

    return window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const answerTimeInterval = setInterval(() => {
      setAnswerTime(answerTime + 1);
    }, 1000);

    return () => {
      clearInterval(answerTimeInterval);
      setAnswerTime(0);
    };
  }, [question]);

  useEffect(() => {
    /**
     * For at kunne svare med tal på keyboardet
     * Tager højde for modifier keys (alt, ctrl, meta)
     */
    const onKeydown = (e) => {
      if (
        !imgOpen &&
        !(
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'INPUT'
        ) &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        let answer = Number(e.key);

        let keys = [1, 2, 3];
        if (keys.includes(answer)) {
          handleAnswer(answer);
        }
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, [question]);

  const text = subSupScript(question.text);
  return (
    <Container className="question">
      <Segment>
        <Grid divided columns="equal" stackable>
          <Grid.Row>
            <Grid.Column>
              <div
                style={{ fontSize: '18px' }}
                dangerouslySetInnerHTML={{
                  __html: marked(text, {
                    smartypants: true
                  })
                }}
              />
              <Responsive as="div" minWidth={breakpoints.mobile + 1}>
                <Divider />

                <QuestionAnswerButtons answer={answer?.answer} handleAnswer={handleAnswer} />
              </Responsive>
            </Grid.Column>
            {question.images.length > 0 && (
              <Grid.Column>
                {question.images.map((image) => (
                  <QuestionImage key={image} img={imageURL(image)} />
                ))}
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
        <Responsive as="div" maxWidth={breakpoints.mobile}>
          <Divider />
          <QuestionAnswerButtons handleAnswer={handleAnswer} answer={answer?.answer} />
        </Responsive>
        <QuestionMetadata />
        <QuestionExtras width={width} />
      </Segment>
      <Divider hidden />
    </Container>
  );
};

export default Question;
