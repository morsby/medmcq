import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
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
export interface QuestionAnswerButtonsProps {}

const QuestionAnswerButtons: React.SFC<QuestionAnswerButtonsProps> = () => {
  const currentQuestionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionIndex]
  );

  return (
    <div>
      {question.answers.map((a) => (
        <div>
          <QuestionAnswerButton answer={a} />
          <QuestionAnswerExplanation answer={a} />
          <Divider hidden />
        </div>
      ))}
    </div>
  );
};

export default QuestionAnswerButtons;
