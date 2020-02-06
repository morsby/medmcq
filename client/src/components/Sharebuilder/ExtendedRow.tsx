import React from 'react';
import _ from 'lodash';

export interface ExtendedRowProps {
  record: any;
}

const ExtendedRow: React.SFC<ExtendedRowProps> = ({ record }) => {
  return (
    <>
      <p
        style={{
          color: _.find(record.correctAnswers, { answer: 1 }) ? 'green' : undefined
        }}
      >
        Svarmulighed 1: {record.answer1.answer}
      </p>
      <p
        style={{
          color: _.find(record.correctAnswers, { answer: 2 }) ? 'green' : undefined
        }}
      >
        Svarmulighed 2: {record.answer2.answer}
      </p>
      <p
        style={{
          color: _.find(record.correctAnswers, { answer: 3 }) ? 'green' : undefined
        }}
      >
        Svarmulighed 3: {record.answer3.answer}
      </p>
    </>
  );
};

export default ExtendedRow;
