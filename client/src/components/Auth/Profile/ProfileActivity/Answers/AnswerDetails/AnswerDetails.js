import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from 'actions';
import _ from 'lodash';

import { Button, Divider } from 'semantic-ui-react';
import { Input } from 'antd';
import { Translate } from 'react-localize-redux';

import AnswerDetailsFilterButtons from './AnswerDetailsFilterButtons';
import { urls, insertOrRemoveFromArray } from 'utils/common';
import { useHistory } from 'react-router';
import AnswersDetailsTable from './AnswersDetailsTable';

/**
 * Component showing answer details.  Any filtering occurs in this component.
 */
const AnswerDetails = ({ answers }) => {
  const [filter, setFilter] = useState(undefined);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState([]);
  const questions = useSelector((state) => state.questions);
  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * A small function that toggles the checkbox using React hooks.
   * @param  {integer} id      The question id to toggle.
   * @param  {bool}    checked Is the checkbox already checked? Should we check or uncheck?
   * @return {null}            Returns nothing, simply updates state.
   */
  const toggleCheckbox = useCallback((id) => {
    setSelected((selected) => insertOrRemoveFromArray(selected, id));
  }, []);

  const startQuiz = async () => {
    history.push(urls.quiz);
    await dispatch(actions.getQuestions({ ids: selected, quiz: true }));
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
        answers = _.pickBy(answers, (a) => a.correct === a.tries);
        break;
      case 'allWrong':
        answers = _.pickBy(answers, (a) => a.correct === 0);
        break;
      default:
        answers = _.pickBy(answers, (a) => a.correct > 0 && a.correct < a.tries);
    }
  }

  if (isSearching) {
    answers = _.pickBy(answers, (a, questionId) =>
      questions.entities.questions[questionId].text.includes(search)
    );
  }

  return (
    <div>
      <Divider hidden />
      <Button basic color="green" onClick={startQuiz} disabled={selected.length === 0}>
        <Translate id="profileAnswerDetails.start_quiz_button" data={{ n: selected.length }} />
      </Button>
      <h4>
        <Translate id="profileAnswerDetails.filter.header" />
      </h4>

      <AnswerDetailsFilterButtons handleClick={setFilter} />
      <Divider />
      <Translate>
        {({ translate }) => (
          <Input
            placeholder={translate('profileAnswerDetails.search')}
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
        )}
      </Translate>

      <AnswersDetailsTable answers={answers} toggleCheckbox={toggleCheckbox} selected={selected} />
    </div>
  );
};

export default AnswerDetails;
