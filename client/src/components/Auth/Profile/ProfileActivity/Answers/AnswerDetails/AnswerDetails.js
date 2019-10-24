import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import _ from 'lodash';

import { Table, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import AnswerDetailsHeaderRow from './AnswerDetailsHeaderRow';
import AnswerDetailsRow from './AnswerDetailsRow';
import AnswerDetailsFilterButtons from './AnswerDetailsFilterButtons';
import { urls, insertOrRemoveFromArray } from 'utils/common';

/**
 * Component showing answer details.  Any filtering occurs in this component.
 */
const AnswerDetails = ({ answers, questions, metadata, getQuestions, history }) => {
  const [filter, setFilter] = useState(undefined);
  const [selected, setSelected] = useState([]);
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
    await getQuestions({ ids: selected, quiz: true });
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

  return (
    <div>
      <Divider hidden />
      <Button onClick={startQuiz} disabled={selected.length === 0}>
        <Translate id="profileAnswerDetails.start_quiz_button" data={{ n: selected.length }} />
      </Button>
      <h4>
        <Translate id="profileAnswerDetails.filter.header" />
      </h4>

      <AnswerDetailsFilterButtons handleClick={setFilter} />
      <Table celled>
        <AnswerDetailsHeaderRow />
        <Table.Body>
          {_.map(answers, (answer, questionId) => (
            <AnswerDetailsRow
              key={questionId}
              answer={answer}
              question={questions.entities.questions[questionId]}
              metadata={metadata}
              handleClick={toggleCheckbox}
              checked={selected.includes(Number(questionId))}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

AnswerDetails.propTypes = {
  /**
   * Array indeholdende besvarede spørgsmål for semesteret
   */
  answers: PropTypes.object,

  questions: PropTypes.object,
  metadata: PropTypes.object,
  history: ReactRouterPropTypes.history,
  /**
   * Henter spørgsmål
   */
  getQuestions: PropTypes.func
};

const mapStateToProps = (state) => ({
  questions: state.questions,
  metadata: state.metadata
});

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(AnswerDetails)
);
