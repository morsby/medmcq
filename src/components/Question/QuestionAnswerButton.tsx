import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { subSupScript } from 'utils/quiz';
import marked from 'marked';
import { Button, Popup } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import { QuestionAnswer } from 'types/generated';
import Quiz from 'classes/Quiz';

export interface QuestionAnswerButtonProps {
  answer: QuestionAnswer;
}

const ButtonInnerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const QuestionAnswerButton: React.SFC<QuestionAnswerButtonProps> = ({ answer }) => {
  const [answerTime, setAnswerTime] = useState(0);
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const allUserAnswers = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.filter((userAnswer) =>
      question.answers.some((a) => a.id === userAnswer.answerId)
    )
  );
  const userAnswer = allUserAnswers.find((userAnswer) => userAnswer.answerId === answer.id);
  const isAnswered = !!userAnswer;
  const hasBeenCorrect = question.answers
    .filter((a) => a.isCorrect)
    .some((a) => allUserAnswers.some((ua) => ua.answerId === a.id));
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const percentagesHided = useSelector((state: ReduxState) => state.quiz.hidePercentages);
  const imgOpen = useSelector((state: ReduxState) => state.quiz.imgOpen);
  const singleMode = useSelector((state: ReduxState) => state.quiz.singleMode);
  const hasBeenAnswered = allUserAnswers.length > 0;
  const multiActivated = singleMode && hasBeenAnswered;

  /**
   * Set up button text
   */
  let answerText;
  switch (answer.index) {
    case 1:
      answerText = 'A. ';
      break;
    case 2:
      answerText = 'B. ';
      break;
    case 3:
      answerText = 'C. ';
      break;
    default:
      break;
  }
  answerText = answerText + answer.text;
  answerText = subSupScript(answerText);

  const evalAnswer = (): any => {
    if (isAnswered && examMode) return 'blue';
    if (examMode) return null;
    if (answer.isCorrect && isAnswered) return 'green';
    if (!answer.isCorrect && isAnswered) return 'red';
    if (!isAnswered && hasBeenCorrect) return 'grey';
    if (singleMode && hasBeenAnswered && !answer.isCorrect) return 'grey';
    if (singleMode && hasBeenAnswered && answer.isCorrect) return 'green';
    return null;
  };

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
    // eslint-disable-next-line
  }, [question]);

  const handleAnswer = useCallback(
    (answerId: number) => {
      if ((isAnswered || multiActivated) && !examMode) return;
      Quiz.answer(
        { answerId, answerTime },
        question.answers.map((a) => a.id),
        examMode
      );
    },
    [answerTime, isAnswered, examMode, question.answers, multiActivated]
  );

  useEffect(() => {
    /**
     * For at kunne svare med tal på keyboardet
     * Tager højde for modifier keys (alt, ctrl, meta)
     */
    const onKeydown = (e: KeyboardEvent) => {
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
        let key = Number(e.key);

        let keys = [1, 2, 3];
        if (keys.includes(key)) {
          const answer = question.answers.find((a) => a.index === key);
          handleAnswer(answer.id);
        }
      }
    };

    document.addEventListener('keydown', onKeydown as any);

    return () => {
      document.removeEventListener('keydown', onKeydown as any);
    };
  }, [question, isAnswered, examMode, handleAnswer, imgOpen]);

  return (
    <Button
      fluid
      style={{ textAlign: 'left' }}
      onClick={() => handleAnswer(answer.id)}
      color={evalAnswer()}
      size="large"
    >
      <ButtonInnerDiv>
        <div
          dangerouslySetInnerHTML={{
            __html: marked(answerText)
          }}
        />
        {(isAnswered || multiActivated) && !percentagesHided && (
          <Popup position="top center" trigger={<span>{answer.correctPercent}%</span>}>
            <Translate id="question.percentage_popup" />
          </Popup>
        )}
      </ButtonInnerDiv>
    </Button>
  );
};

export default QuestionAnswerButton;
