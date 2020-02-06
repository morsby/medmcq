import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Question from 'classes/Question';
import { subSupScript, evalAnswer } from 'utils/quiz';
import marked from 'marked';
import { Button, Popup } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

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
  handleAnswer
}) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const userAnswer = useSelector(
    (state: ReduxState) =>
      state.quiz.answers.find((answer) => answer.questionId === question.id)?.answer
  );
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const percentagesHided = useSelector((state: ReduxState) => state.quiz.hidePercentages);
  const answer: Question['answer1'] = question[`answer${answerNumber}`];

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
  answerText = answerText + answer.answer;
  answerText = subSupScript(answerText);

  return (
    <Button
      style={{ textAlign: 'left' }}
      onClick={() => handleAnswer(answerNumber)}
      color={evalAnswer(question, userAnswer, answerNumber, examMode)}
      size="large"
    >
      <ButtonInnerDiv>
        <div
          dangerouslySetInnerHTML={{
            __html: marked(answerText)
          }}
        />
        {userAnswer && !percentagesHided && (
          <Popup position="top center" trigger={<span>{answer.correctPercent}%</span>}>
            <Translate id="question.percentage_popup" />
          </Popup>
        )}
      </ButtonInnerDiv>
    </Button>
  );
};

export default QuestionAnswerButton;
