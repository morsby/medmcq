import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Divider, Segment } from 'semantic-ui-react';
import QuestionMetadata from 'components/Question/QuestionMetadata';
import QuestionExtras from 'components/Question/QuestionExtras';
import { ReduxState } from 'redux/reducers';
import QuestionDisplay from './QuestionDisplay';
import useWidth from 'hooks/useWidth';
import CreateQuestionForm from 'components/CreateQuestion/CreateQuestionForm';

/**
 * Component ansvarlig for at vise selve spørgsmålet, evt. billeder, kommentarer
 * og svar.
 */
export interface QuestionProps {}

const Question: React.SFC<QuestionProps> = () => {
  const { width } = useWidth();
  const user = useSelector((state: ReduxState) => state.auth.user);
  const isEditing = useSelector((state: ReduxState) => state.questions.isEditing);
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const currentQuestionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionIndex]
  );

  return (
    <Container className="question">
      <Segment>
        {user?.role.id < 3 && isEditing ? (
          <CreateQuestionForm question={question} />
        ) : (
          <QuestionDisplay />
        )}
        {!examMode && <QuestionMetadata />}
        {!examMode && <QuestionExtras width={width} />}
      </Segment>
      <Divider hidden />
    </Container>
  );
};

export default Question;
