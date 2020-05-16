import React from 'react';
import _ from 'lodash';
import Question from 'classes/Question';

export interface ExtendedRowProps {
  record: Question;
}

const ExtendedRow: React.SFC<ExtendedRowProps> = ({ record }) => {
  const answer1 = record.answers.find((a) => a.index === 1);
  const answer2 = record.answers.find((a) => a.index === 2);
  const answer3 = record.answers.find((a) => a.index === 3);

  return (
    <>
      <p
        style={{
          color: answer1.isCorrect ? 'green' : undefined
        }}
      >
        Svarmulighed 1: {answer1.text}
      </p>
      <p
        style={{
          color: answer2.isCorrect ? 'green' : undefined
        }}
      >
        Svarmulighed 2: {answer2.text}
      </p>
      <p
        style={{
          color: answer3.isCorrect ? 'green' : undefined
        }}
      >
        Svarmulighed 3: {answer3.text}
      </p>
    </>
  );
};

export default ExtendedRow;
