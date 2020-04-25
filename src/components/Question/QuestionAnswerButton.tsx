import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Question from 'classes/Question';
import { subSupScript, evalAnswer } from 'utils/quiz';
import marked from 'marked';
import { Button, Popup } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import { QuestionAnswer } from 'types/generated';

export interface QuestionAnswerButtonProps {
  answerNumber: number;
  handleAnswer: Function;
}

const ButtonInnerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const QuestionAnswerButton: React.SFC<QuestionAnswerButtonProps> = ({
  answerNumber,
  handleAnswer,
}) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const answer: QuestionAnswer = question.answers.find((a) => a.index === answerNumber);
  const userAnswer = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.find((userAnswer) => userAnswer.answerId === answer.id)
  );
  const isAnswered = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.some((userAnswer) =>
      question.answers.map((a) => a.id).includes(userAnswer.answerId)
    )
  );
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const percentagesHided = useSelector((state: ReduxState) => state.quiz.hidePercentages);
  if (!answer) return null;

  /**
   * Set up button text
   */
  let answerText;
  switch (answerNumber) {
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

  return (
    <Button
      style={{ textAlign: 'left' }}
      onClick={() => handleAnswer(answer.id)}
      color={evalAnswer(userAnswer, answer, examMode, isAnswered)}
      size="large"
    >
      <ButtonInnerDiv>
        <div
          dangerouslySetInnerHTML={{
            __html: marked(answerText),
          }}
        />
        {isAnswered && !percentagesHided && (
          <Popup position="top center" trigger={<span>{answer.correctPercent}%</span>}>
            <Translate id="question.percentage_popup" />
          </Popup>
        )}
      </ButtonInnerDiv>
    </Button>
  );
};

export default QuestionAnswerButton;
