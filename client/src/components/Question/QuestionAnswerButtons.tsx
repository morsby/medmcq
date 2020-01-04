import React from 'react';
import { Button, Divider, Popup } from 'semantic-ui-react';
import { evalAnswer, subSupScript } from 'utils/quiz';
import marked from 'marked';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { QuestionAnswer } from 'classes/Question';

/**
 * Component der viser svarmuligheder.
 * Alle props er fra Question.js
 * @param {Boolean} pristine Hvorvidt musen er blevet rykket. Bruges til styling.
 * @param {func}    onAnswer Func der kaldes når der svares på spg.
 * @param {object}  question Selve spørgsmålet.
 */
export interface QuestionAnswerButtonsProps {
  chosenAnswer: number | undefined;
  handleAnswer: Function;
}

const QuestionAnswerButtons: React.SFC<QuestionAnswerButtonsProps> = ({
  handleAnswer,
  chosenAnswer
}) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);

  const generateButton = (answerNo: number) => {
    const answer: QuestionAnswer = question[`answer${answerNo}`];

    let answerText;
    switch (answerNo) {
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
    /**
     * subSupScript tillader sub- og superscripts vha. markdown-syntaks.
     */
    answerText = subSupScript(answerText);
    return (
      <Button
        style={{ textAlign: 'left' }}
        onClick={() => handleAnswer(answerNo)}
        color={evalAnswer(question, chosenAnswer, answerNo)}
        size="large"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center'
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: marked(answerText)
            }}
          />
          {chosenAnswer && (
            <Popup position="top center" trigger={<span>{answer.correctPercent}%</span>}>
              Procent af alle, der har besvaret spørgsmålet med dette valg.
            </Popup>
          )}
        </div>
      </Button>
    );
  };

  return (
    <Button.Group vertical fluid>
      {generateButton(1)}
      <Divider hidden />
      {generateButton(2)}
      <Divider hidden />
      {generateButton(3)}
    </Button.Group>
  );
};

export default QuestionAnswerButtons;
