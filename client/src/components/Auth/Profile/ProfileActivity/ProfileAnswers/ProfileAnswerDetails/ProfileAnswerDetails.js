import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Table, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import ProfileAnswerDetailsHeaderRow from './ProfileAnswerDetailsHeaderRow';
import ProfileAnswerDetailsRow from './ProfileAnswerDetailsRow';
import ProfileAnswerDetailsFilterButtons from './ProfileAnswerDetailsFilterButtons';

/**
 * Component showing answer details.  Any filtering occurs in this component.
 */
const ProfileAnswerDetails = ({ answers }) => {
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
      <Button onClick={() => alert('Implement startQuiz')} disabled={selected.length === 0}>
        <Translate id="profileAnswerDetails.start_quiz_button" data={{ n: selected.length }} />
      </Button>
      <h4>
        <Translate id="profileAnswerDetails.filter.header" />
      </h4>

      <ProfileAnswerDetailsFilterButtons handleClick={setFilter} />
      <Table celled>
        <ProfileAnswerDetailsHeaderRow />
        <Table.Body>
          {_.map(answers, (answer) => (
            <ProfileAnswerDetailsRow
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

ProfileAnswerDetails.propTypes = {
  /**
   * Array indeholdende besvarede spørgsmål for semesteret
   */
  answers: PropTypes.array
};

export default ProfileAnswerDetails;
