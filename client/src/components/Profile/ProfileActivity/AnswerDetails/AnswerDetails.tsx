import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { Button, Divider } from 'semantic-ui-react';
import { Input } from 'antd';
import { Translate } from 'react-localize-redux';

import AnswerDetailsFilterButtons from './AnswerDetailsFilterButtons';
import { urls } from 'utils/common';
import { useHistory } from 'react-router';
import AnswersDetailsTable from './AnswersDetailsTable';
import { ReduxState } from 'redux/reducers';
import Quiz from 'classes/Quiz';

/**
 * Component showing answer details.  Any filtering occurs in this component.
 */
export interface AnswerDetailsProps {}

const AnswerDetails: React.SFC<AnswerDetailsProps> = () => {
  const [filter, setFilter] = useState(undefined);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const questions = useSelector((state: ReduxState) => state.questions.questions);
  let answers = useSelector((state: ReduxState) => state.profile.answers);
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const history = useHistory();

  /**
   * A small function that toggles the checkbox using React hooks.
   * @param  {Array} ids      The question ids (array) to toggle.
   * @param  {bool}    checked Is the checkbox already checked? Should we check or uncheck?
   * @return {null}            Returns nothing, simply updates state.
   */
  const toggleCheckbox = useCallback((ids) => {
    setSelected(ids);
  }, []);

  const startQuiz = async (ids) => {
    setQuizLoading(true);
    await Quiz.start({ ids });
    history.push(urls.quiz);
  };

  const handleSearch = (search) => {
    if (search.length > 1) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    setSearch(search);
  };

  if (filter) {
    switch (filter) {
      case 'allRight':
        answers = answers.filter((answer) => tries[answer.id].correct === tries[answer.id].tries);
        break;
      case 'allWrong':
        answers = answers.filter((answer) => tries[answer.id].correct === 0);
        break;
      default:
        answers = answers.filter(
          (answer) =>
            tries[answer.id].correct > 0 && tries[answer.id].correct < tries[answer.id].tries
        );
    }
  }

  if (isSearching) {
    answers = answers.filter(
      (answer) =>
        questions.find((question) => question.id === answer.question.id).text.indexOf(search) !== -1
    );
  }

  return (
    <div>
      <Button
        basic
        color="green"
        onClick={() => startQuiz(selected)}
        disabled={selected.length === 0 || quizLoading}
        loading={quizLoading}
      >
        <Translate id="profileAnswerDetails.start_quiz_button" data={{ n: selected.length }} />
      </Button>
      <Button
        loading={quizLoading}
        disabled={quizLoading}
        basic
        color="green"
        onClick={() => startQuiz(Object.keys(answers))}
      >
        <Translate
          id="profileAnswerDetails.start_quiz_all_button"
          data={{ n: Object.keys(answers).length }}
        />
      </Button>

      <h4>
        <Translate id="profileAnswerDetails.filter.header" />
      </h4>

      <AnswerDetailsFilterButtons handleClick={setFilter} />
      <Divider />
      <Translate>
        {({ translate }) => (
          <Input
            placeholder={translate('profileAnswerDetails.search') as string}
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
        )}
      </Translate>

      <AnswersDetailsTable
        answers={answers}
        toggleCheckbox={toggleCheckbox}
        questions={questions}
      />
    </div>
  );
};

export default AnswerDetails;
