import React from 'react';
import { Container, Menu, Icon } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import QuestionExamModeCounter from 'components/Question/QuestionExamModeCounter';

/**
 * En menu, der tillader navigation i quizzen frem og tilbage samt viser
 * aktuelle spørgsmål.
 * Vises både over og under spørgsmålet.
 * Alle props kommer fra Quiz.js og beskrives i bunden.
 */
export interface QuizNavigatorProps {
  handleNavigate: Function;
  position?: string;
}

const QuizNavigator: React.SFC<QuizNavigatorProps> = ({ position, handleNavigate }) => {
  const qn = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const qmax = useSelector((state: ReduxState) => state.questions.questions.length);
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);

  return (
    <Container {...(position === 'top' ? { className: 'top-nav' } : {})}>
      <Menu size="large" fluid widths={3}>
        <Menu.Item {...(qn <= 0 ? { disabled: true } : {})} onClick={() => handleNavigate(qn - 1)}>
          <Icon name="step backward" />
          <Translate id="quizNavigator.previous" />
        </Menu.Item>
        <Menu.Item header>
          {position === 'top' && (
            <div style={{ fontSize: '0.9em' }}>
              <Translate id="quizNavigator.progress" data={{ n: qn + 1, total: qmax }} />
              {examMode && <QuestionExamModeCounter />}
            </div>
          )}
        </Menu.Item>
        <Menu.Item
          {...(qn + 1 >= qmax ? { disabled: true } : {})}
          onClick={() => handleNavigate(qn + 1)}
        >
          <Translate id="quizNavigator.next" />
          <Icon name="step forward" />
        </Menu.Item>
      </Menu>
    </Container>
  );
};

export default QuizNavigator;
