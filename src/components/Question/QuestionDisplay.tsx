import React, { useState, useEffect } from 'react';
import { Grid, Responsive, Divider } from 'semantic-ui-react';
import QuestionAnswerButtons from './QuestionAnswerButtons';
import { subSupScript } from 'utils/quiz';
import marked from 'marked';
import { ReduxState } from 'redux/reducers';
import { useSelector } from 'react-redux';
import { breakpoints, imageURL } from 'utils/common';
import Quiz from 'classes/Quiz';
import QuestionImage from './QuestionImage';

export interface QuestionDisplayProps {}

const QuestionDisplay: React.SFC<QuestionDisplayProps> = () => {
  const [answerTime, setAnswerTime] = useState(0);
  const currentQuestionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionIndex]
  );
  const answered = useSelector(
    (state: ReduxState) => !!state.quiz.answers.find((answer) => answer.questionId === question.id)
  );
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const imgOpen = useSelector((state: ReduxState) => state.quiz.imgOpen);

  useEffect(() => {
    setAnswerTime(0);
  }, [question]);

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
  }, [question, answered, examMode]);

  const handleAnswer = (answer: number) => {
    if (answered && !examMode) return;
    Quiz.answer({ answer, answerTime, questionId: question.id }, examMode);
  };

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
              <QuestionAnswerButtons handleAnswer={handleAnswer} />
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
        <QuestionAnswerButtons handleAnswer={handleAnswer} />
      </Responsive>
    </div>
  );
};

export default QuestionDisplay;
