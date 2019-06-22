import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import { Table, Checkbox } from 'semantic-ui-react';

/**
 * Component that shows details of a single answered question
 */
const AnswerDetailsRow = ({ answer, question, metadata, handleClick, checked }) => {
  let { specialties, examSets } = metadata.entities;
  return (
    <Table.Row
      verticalAlign="top"
      positive={answer.correct === answer.tries}
      warning={answer.correct < answer.tries && answer.correct > 0}
      error={answer.correct === 0}
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
        {_.map(question.specialties, ({ specialtyId }) => specialties[specialtyId].name).join('|')}
      </Table.Cell>
      <Table.Cell collapsing>
        <Translate id={`profileAnswerDetails.${examSets[question.examSetId].season}`} />
        {examSets[question.examSetId].year}
      </Table.Cell>
      <Table.Cell collapsing textAlign="right">
        {Math.round((answer.correct / answer.tries) * 100, 2)}%
      </Table.Cell>
    </Table.Row>
  );
};

AnswerDetailsRow.propTypes = {
  /**
   * The question
   */
  question: PropTypes.object,

  metadata: PropTypes.object,
  /**
   * The performance and history
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
