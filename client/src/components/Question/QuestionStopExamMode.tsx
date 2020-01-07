import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Quiz from 'classes/Quiz';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface QuestionStopExamModeProps {}

const QuestionStopExamMode: React.SFC<QuestionStopExamModeProps> = () => {
  const answers = useSelector((state: ReduxState) => state.quiz.answers);
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
          Færdiggør eksamen, og se alle svar
        </Button>
      </div>
      <Modal
        centered
        visible={modalOpen}
        onOk={handleStopExam}
        onCancel={() => setModalOpen(false)}
        cancelText="Annuller"
        okText="Ja, afslut denne eksamen!"
      >
        Er du sikker på, at du vil stoppe din eksamen?
      </Modal>
    </div>
  );
};

export default QuestionStopExamMode;
