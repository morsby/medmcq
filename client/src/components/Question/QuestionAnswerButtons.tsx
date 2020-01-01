import React from 'react';
import PropTypes from 'prop-types';

import { Button, Divider } from 'semantic-ui-react';

import { evalAnswer, subSupScript } from 'utils/quiz';
import marked from 'marked';
import Question from 'classes/Question';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

/**
 * Component der viser svarmuligheder.
 * Alle props er fra Question.js
 * @param {Boolean} pristine Hvorvidt musen er blevet rykket. Bruges til styling.
 * @param {func}    onAnswer Func der kaldes når der svares på spg.
 * @param {object}  question Selve spørgsmålet.
 */
export interface QuestionAnswerButtonsProps {
  answer: number;
  handleAnswer: Function;
}

const QuestionAnswerButtons: React.SFC<QuestionAnswerButtonsProps> = ({ handleAnswer, answer }) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  /**
   * Func der prefixer svarmuligheder med A, B og C samt laver knappen.
   * @param  {Number} answerNo Svarmulighed nr. 1, 2 el. 3
   * @return {Comp}            Selve knappen.
   */
  const generateButton = (answerNo) => {
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
    answerText = answerText + question[`answer${answerNo}`];
    /**
     * subSupScript tillader sub- og superscripts vha. markdown-syntaks.
     */
    answerText = subSupScript(answerText);
    return (
      <Button
        style={{ textAlign: 'left' }}
        onClick={() => handleAnswer(answerNo)}
        color={evalAnswer(question, answer, answerNo)}
        size="large"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: marked(answerText)
          }}
        />
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
