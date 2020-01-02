import React, { useState } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import AnswerDetails from './AnswerDetails/AnswerDetails';
import AnswerTagsDetailsTable from './AnswerDetails/AnswerTagsDetailsTable';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
/**
 * Component that displays a summary of the answered questions.
 */

export interface AnswersProps {}

const Answers: React.SFC<AnswersProps> = () => {
  const [details, toggleDetails] = useState(false);
  const [tagDetailsOpen, setTagsDetailsOpen] = useState(false);
  const answers = useSelector((state: ReduxState) => state.profile.answers);
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const privateComments = useSelector((state: ReduxState) => state.profile.privateComments);
  const publicComments = useSelector((state: ReduxState) => state.profile.publicComments);

  const onToggleDetails = () => {
    toggleDetails(!details);
  };

  let totalAnswers = answers.length;
  let allRight = _.filter(tries, (attempt) => attempt.tries === attempt.correct);
  let allWrong = _.filter(tries, (a) => a.correct === 0);
  let mixed = _.filter(tries, (a) => a.correct > 0 && a.correct < a.tries);
  return (
    <div>
      <p>
        <Translate id="profileAnswers.summary" data={{ total: totalAnswers }} />
        <br />
        <Translate
          id="profileAnswers.comments"
          data={{ pub: publicComments.length, pri: privateComments.length }}
        />
      </p>
      <Divider />
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
      <Button basic color="blue" onClick={onToggleDetails} disabled={totalAnswers === 0}>
        {details && totalAnswers > 0 ? (
          <Translate id="profileAnswers.buttons.details.hide_details" />
        ) : (
          <Translate id="profileAnswers.buttons.details.show_details" />
        )}
      </Button>
      <Button basic color="blue" onClick={() => setTagsDetailsOpen((prevState) => !prevState)}>
        {!tagDetailsOpen ? 'Vis Tag Detaljer' : 'Skjul Tag Detaljer'}
      </Button>
      <Divider hidden />
      {details && totalAnswers > 0 && <AnswerDetails />}
      {tagDetailsOpen && <AnswerTagsDetailsTable />}
    </div>
  );
};

export default Answers;
