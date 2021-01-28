import React from 'react';
import { Divider } from 'semantic-ui-react';
import QuestionAnswerButton from './QuestionAnswerButton';
import QuestionAnswerExplanation from './QuestionAnswerExplanation';

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
    <div>
      <QuestionAnswerButton answerNumber={1} handleAnswer={handleAnswer} />
      <QuestionAnswerExplanation answerNumber={1} />
      <Divider hidden />
      <QuestionAnswerButton answerNumber={2} handleAnswer={handleAnswer} />
      <QuestionAnswerExplanation answerNumber={2} />
      <Divider hidden />
      <QuestionAnswerButton answerNumber={3} handleAnswer={handleAnswer} />
      <QuestionAnswerExplanation answerNumber={3} />
    </div>
  );
};

export default QuestionAnswerButtons;
