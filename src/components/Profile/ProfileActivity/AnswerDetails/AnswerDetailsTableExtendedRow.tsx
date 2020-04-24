import React from 'react';
import _ from 'lodash';
import Question from 'classes/Question';

export interface AnswerDetailsTableExtendedRow {
  question: Question;
}

const AnswerDetailsTableExtendedRow: React.SFC<AnswerDetailsTableExtendedRow> = ({ question }) => {
  return (
    <>
      <p
        style={{
          color: _.indexOf(question.correctAnswers, 1) !== -1 ? 'green' : undefined,
        }}
      >
        Svarmulighed 1: {question.answer1.answer}
      </p>
      <p
        style={{
          color: _.indexOf(question.correctAnswers, 2) !== -1 ? 'green' : undefined,
        }}
      >
        Svarmulighed 2: {question.answer2.answer}
      </p>
      <p
        style={{
          color: _.indexOf(question.correctAnswers, 3) !== -1 ? 'green' : undefined,
        }}
      >
        Svarmulighed 3: {question.answer3.answer}
      </p>
    </>
  );
};

export default AnswerDetailsTableExtendedRow;
