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

/**
 * Component ansvarlig for at vise selve spørgsmålet, evt. billeder, kommentarer
 * og svar.
 */
export interface QuestionProps {}

const Question: React.SFC<QuestionProps> = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [answerTime, setAnswerTime] = useState(0);
  const currentQuestionNumber = useSelector(
    (state: ReduxState) => state.quiz.currentQuestionNumber
  );
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionNumber]
  );
  const answers = useSelector((state: ReduxState) => state.quiz.answers);
  const user = useSelector((state: ReduxState) => state.auth.user);

  useEffect(() => {
    setAnswerTime(0);
  }, [question]);

  useEffect(() => {
    let handleResize = () => setInnerWidth(window.innerWidth);
    handleResize = _.debounce(handleResize, 300);

    window.addEventListener('resize', handleResize);

    return window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const answerTimeInterval = setInterval(() => {
      this.setState((prevState) => ({ answerTime: prevState.answerTime + 1 }));
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
        !this.props.imgOpen &&
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
          this.onAnswer(answer);
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
                ref={(ref) => (this._div = ref)}
              />
              <Responsive as="div" minWidth={breakpoints.mobile + 1}>
                <Divider />

                <QuestionAnswerButtons
                  question={question}
                  answer={answers[question.id]}
                  onAnswer={this.onAnswer}
                />
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
          <QuestionAnswerButtons
            question={question}
            answer={answers[question.id]}
            onAnswer={this.onAnswer}
          />
        </Responsive>
        <QuestionMetadata />
        <QuestionExtras
          deleteComment={this.props.deleteComment}
          commentQuestion={this.props.commentQuestion}
          editComment={this.props.editComment}
          questionReport={this.props.questionReport}
          width={this.state.width}
          question={question}
          user={user}
        />
      </Segment>
      <Divider hidden />
    </Container>
  );
};

export default Question;
