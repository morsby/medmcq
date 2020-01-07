import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import Quiz from 'classes/Quiz';
import { urls } from 'utils/common';
import { ReduxState } from 'redux/reducers';
import { useHistory } from 'react-router-dom';
import Selection from 'classes/Selection';
import { useSelector } from 'react-redux';

export interface SelectionStartButtonProps {}

const SelectionStartButton: React.SFC<SelectionStartButtonProps> = () => {
  const [startLoading, setStartLoading] = useState(false);
  const history = useHistory();
  const quizQuestions = useSelector((state: ReduxState) => state.questions.questions);

  const handleStart = async (examMode?: boolean) => {
    setStartLoading(true);
    await Quiz.start(null, examMode);
    Selection.change({ type: 'search', value: '' });
    history.push(urls.quiz);
  };

  const handleContinue = async () => {
    history.push(urls.quiz);
  };

  return (
    <div>
      <Button
        loading={startLoading}
        disabled={startLoading}
        style={{ cursor: 'pointer' }}
        fluid
        color="green"
        basic
        onClick={() => handleStart()}
      >
        Start!
      </Button>
      <div style={{ height: '5px' }} />
      <Button
        loading={startLoading}
        disabled={startLoading}
        style={{ cursor: 'pointer' }}
        fluid
        color="blue"
        basic
        onClick={() => handleStart(true)}
      >
        Start som eksamen
      </Button>
      <div style={{ height: '5px' }} />
      {quizQuestions.length > 0 && (
        <Button basic fluid color="orange" onClick={() => handleContinue()}>
          <Translate id="selection.static.continue_quiz" />
        </Button>
      )}
    </div>
  );
};

export default SelectionStartButton;
