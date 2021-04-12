import React from 'react';
import Question from 'classes/Question';

export interface AnswerDetailsTableExtendedRow {
  question: Question;
}

const AnswerDetailsTableExtendedRow: React.SFC<AnswerDetailsTableExtendedRow> = ({ question }) => {
  return (
    <>
      {question.answers.map((a) => (
        <p
          style={{
            color: a.isCorrect ? 'green' : undefined
          }}
        >
          Svarmulighed {a.index}: {a.text}
        </p>
      ))}
    </>
  );
};

export default AnswerDetailsTableExtendedRow;
