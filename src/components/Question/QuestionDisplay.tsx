import React from 'react';
import { Grid, Responsive, Divider } from 'semantic-ui-react';
import QuestionAnswerButtons from './QuestionAnswerButtons';
import { subSupScript } from 'utils/quiz';
import marked from 'marked';
import { ReduxState } from 'redux/reducers';
import { useSelector } from 'react-redux';
import { breakpoints, imageURL } from 'utils/common';
import QuestionImage from './QuestionImage';

export interface QuestionDisplayProps {}

const QuestionDisplay: React.SFC<QuestionDisplayProps> = () => {
  const currentQuestionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionIndex]
  );

  const text = subSupScript(question.text);
  return (
    <div>
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
              <QuestionAnswerButtons />
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
        <QuestionAnswerButtons />
      </Responsive>
    </div>
  );
};

export default QuestionDisplay;
