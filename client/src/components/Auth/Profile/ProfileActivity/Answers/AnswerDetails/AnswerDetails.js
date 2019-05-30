import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../../../../actions';
import _ from 'lodash';

import { Table, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import AnswerDetailsHeaderRow from './AnswerDetailsHeaderRow';
import AnswerDetailsRow from './AnswerDetailsRow';
import AnswerDetailsFilterButtons from './AnswerDetailsFilterButtons';

/**
 * Component showing answer details.  Any filtering occurs in this component.
 */
const AnswerDetails = ({ answers, getQuestions }) => {
  const [filter, setFilter] = useState(undefined);
  const [selected, setSelected] = useState([]);

  /**
   * A small function that toggles the checkbox using React hooks.
   * @param  {integer} id      The question id to toggle.
   * @param  {bool}    checked Is the checkbox already checked? Should we check or uncheck?
   * @return {null}            Returns nothing, simply updates state.
   */
  const toggleCheckbox = (id, checked) => {
    checked ? setSelected(_.filter(selected, (el) => el !== id)) : setSelected([...selected, id]);
  };

  const startQuiz = () => {
    getQuestions({ type: 'ids', ids: selected });
  };

  if (filter) {
    switch (filter) {
      case 'allRight':
        answers = _.filter(answers, (a) => a.performance.correct === a.performance.tries);
        break;
      case 'allWrong':
        answers = _.filter(answers, (a) => a.performance.correct === 0);
        break;
      default:
        answers = _.filter(
          answers,
          (a) => a.performance.correct > 0 && a.performance.correct < a.performance.tries
        );
    }
  }

  // TODO: Tillad sortering
  return (
    <div>
      <Divider hidden />
      <Button onClick={startQuiz} disabled={selected.length === 0}>
        <Translate id='profileAnswerDetails.start_quiz_button' data={{ n: selected.length }} />
      </Button>
      <h4>
        <Translate id='profileAnswerDetails.filter.header' />
      </h4>

      <AnswerDetailsFilterButtons handleClick={setFilter} />
      <Table celled>
        <AnswerDetailsHeaderRow />
        <Table.Body>
          {_.map(answers, (answer) => (
            <AnswerDetailsRow
              key={answer.question.id}
              answer={answer}
              handleClick={toggleCheckbox}
              checked={selected.indexOf(answer.question.id) > -1}
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
  answers: PropTypes.array,

  /**
   * Henter spørgsmål
   */
  getQuestions: PropTypes.func
};

export default connect(
  null,
  actions
)(AnswerDetails);
