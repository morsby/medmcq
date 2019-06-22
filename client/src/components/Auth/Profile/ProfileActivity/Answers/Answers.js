import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import AnswerDetails from './AnswerDetails/AnswerDetails';

/**
 * Component that displays a summary of the answered questions.
 */
const Answers = ({ answers = {}, questions = {} }) => {
  const [details, toggleDetails] = useState(false);

  let totalAnswers = Object.keys(answers).length;
  let allRight = _.filter(answers, (a) => a.tries === a.correct);
  let allWrong = _.filter(answers, (a) => a.correct === 0);
  let mixed = _.filter(answers, (a) => a.correct > 0 && a.correct < a.tries);
  return (
    <div>
      <p>
        <Translate id="profileAnswers.summary" data={{ total: totalAnswers }} />
      </p>
      <div>
        <p>
          <Translate id="profileAnswers.answers.header" />
        </p>
        <ul className="ui list analysis">
          <li className="item">
            <Translate id="profileAnswers.answers.correct" data={{ n: allRight.length }} />
          </li>
          <li className="item">
            <Translate id="profileAnswers.answers.wrong" data={{ n: allWrong.length }} />
          </li>
          <li className="item">
            <Translate id="profileAnswers.answers.mixed" data={{ n: mixed.length }} />
          </li>
        </ul>
      </div>

      <Divider hidden />
      <Button onClick={() => toggleDetails(!details)} disabled={totalAnswers === 0}>
        {details && totalAnswers > 0 ? (
          <Translate id="profileAnswers.buttons.details.hide_details" />
        ) : (
          <Translate id="profileAnswers.buttons.details.show_details" />
        )}
      </Button>
      {details && totalAnswers > 0 && <AnswerDetails answers={answers} questions={questions} />}
    </div>
  );
};

Answers.propTypes = {
  /**
   * The answers, unfiltered
   */
  answers: PropTypes.object,

  questions: PropTypes.object
};

export default Answers;
