import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import Quiz from 'classes/Quiz';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { LocalizeContextProps, withLocalize, Translate } from 'react-localize-redux';

export interface QuestionStopExamModeProps extends LocalizeContextProps {}

const QuestionStopExamMode: React.SFC<QuestionStopExamModeProps> = ({ translate }) => {
  const answers = useSelector((state: ReduxState) => state.quiz.userAnswers);
  const questions = useSelector((state: ReduxState) => state.questions.questions);
  const [modalOpen, setModalOpen] = useState(false);

  const handleStopExam = async () => {
    await Quiz.stopExam();
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={() => setModalOpen(true)}
          basic={answers.length !== questions.length}
          color={answers.length === questions.length ? 'green' : 'red'}
        >
          <Translate id="question.stopExamButton" />
        </Button>
      </div>
      <Modal
        centered
        title={translate('question.stopExamModalTitle')}
        visible={modalOpen}
        onOk={handleStopExam}
        onCancel={() => setModalOpen(false)}
        cancelText={translate('question.stopExamCancel')}
        okText={translate('question.stopExamOk')}
      >
        <Translate id="question.stopExamConfirmation" />
      </Modal>
    </div>
  );
};

export default withLocalize(QuestionStopExamMode);
