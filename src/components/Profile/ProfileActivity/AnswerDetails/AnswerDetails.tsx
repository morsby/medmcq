import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Button, Divider } from 'semantic-ui-react';
import { Input } from 'antd';
import { Translate } from 'react-localize-redux';

import AnswerDetailsFilterButtons from './AnswerDetailsFilterButtons';
import { urls } from 'utils/common';
import { useHistory } from 'react-router';
import AnswersDetailsTable from './AnswersDetailsTable';
import { ReduxState } from 'redux/reducers';
import Quiz from 'classes/Quiz';
import _ from 'lodash';

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
  let userAnswers = useSelector((state: ReduxState) => state.profile.userAnswers);
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const history = useHistory();

  /**
   * A small function that toggles the checkbox using React hooks.
   * @param  {Array} ids      The question ids (array) to toggle.
   * @param  {bool}    checked Is the checkbox already checked? Should we check or uncheck?
   * @return {null}            Returns nothing, simply updates state.
   */
  const toggleCheckbox = (ids: number[]) => {
    setSelected(ids);
  };

  const startQuiz = async (ids: string[]) => {
    setQuizLoading(true);
    const nIds = ids.map((id) => Number(id));
    await Quiz.start({ ids: nIds });
    history.push(urls.quiz);
  };

  const handleSearch = (search: string) => {
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
        userAnswers = userAnswers.filter(
          (ua) =>
            tries.find((t) => t.questionId === ua.answer.question.id).correct ===
            tries.find((t) => t.questionId === ua.answer.question.id).tries
        );
        break;
      case 'allWrong':
        userAnswers = userAnswers.filter(
          (ua) => tries.find((t) => t.questionId === ua.answer.question.id).correct === 0
        );
        break;
      default:
        userAnswers = userAnswers.filter(
          (ua) =>
            tries.find((t) => t.questionId === ua.answer.question.id).correct > 0 &&
            tries.find((t) => t.questionId === ua.answer.question.id).correct <
              tries.find((t) => t.questionId === ua.answer.question.id).tries
        );
    }
  }

  if (isSearching) {
    userAnswers = userAnswers.filter((ua) => ua.answer.question.text.includes(search));
  }

  userAnswers = _.uniqBy(userAnswers, (ua) => ua.answer.question.id);
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
        onClick={() => startQuiz(Object.keys(userAnswers))}
      >
        <Translate
          id="profileAnswerDetails.start_quiz_all_button"
          data={{ n: Object.keys(userAnswers).length }}
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
        selectedIds={selected}
        answers={userAnswers}
        toggleCheckbox={toggleCheckbox}
      />
    </div>
  );
};

export default AnswerDetails;
