import React from 'react';
import { Button, Divider } from 'semantic-ui-react';
import QuestionAnswerButton from './QuestionAnswerButton';

/**
 * Component der viser svarmuligheder.
 * Alle props er fra Question.js
 * @param {Boolean} pristine Hvorvidt musen er blevet rykket. Bruges til styling.
 * @param {func}    onAnswer Func der kaldes når der svares på spg.
 * @param {object}  question Selve spørgsmålet.
 */
export interface QuestionAnswerButtonsProps {
  handleAnswer: Function;
}

const QuestionAnswerButtons: React.SFC<QuestionAnswerButtonsProps> = ({ handleAnswer }) => {
  return (
    <Button.Group vertical fluid>
      <QuestionAnswerButton answerNumber={1} handleAnswer={handleAnswer} />
      <Divider hidden />
      <QuestionAnswerButton answerNumber={2} handleAnswer={handleAnswer} />
      <Divider hidden />
      <QuestionAnswerButton answerNumber={3} handleAnswer={handleAnswer} />
    </Button.Group>
  );
};

export default QuestionAnswerButtons;
