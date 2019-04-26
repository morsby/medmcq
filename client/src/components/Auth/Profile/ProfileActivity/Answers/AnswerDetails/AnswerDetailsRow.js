import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import { Translate } from 'react-localize-redux';
import { Table, Checkbox } from 'semantic-ui-react';

/**
 * Component that shows details of a single answered question
 */
const AnswerDetailsRow = ({ answer, handleClick, checked }) => {
  let { question } = answer;

  return (
    <Table.Row
      verticalAlign="top"
      positive={answer.performance.correct === answer.performance.tries}
      warning={
        answer.performance.correct < answer.performance.tries && answer.performance.correct > 0
      }
      error={answer.performance.correct === 0}
    >
      <Table.Cell>
        <Checkbox onChange={() => handleClick(question.id, checked)} checked={checked} />
      </Table.Cell>
      <Table.Cell>
        <div
          dangerouslySetInnerHTML={{
            __html: marked(question.text)
          }}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        {question.specialties.map((spec) => spec.specialtyName).join('|')}
      </Table.Cell>
      <Table.Cell collapsing>
        <Translate id={`profileAnswerDetails.${question.examSet.season}`} />
        {question.examSet.year}
      </Table.Cell>
      <Table.Cell collapsing textAlign="right">
        {Math.round((answer.performance.correct / answer.performance.tries) * 100, 2)}%
      </Table.Cell>
    </Table.Row>
  );
};

AnswerDetailsRow.propTypes = {
  /**
   * The answer (including props `question` and `performance`)
   */
  answer: PropTypes.object,
  /**
   * Function that toggles the checkbox
   */
  handleClick: PropTypes.func,
  /**
   * Whether the checkbox is checked
   */
  checked: PropTypes.bool
};

export default AnswerDetailsRow;
