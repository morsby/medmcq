import React from 'react';
import { Form, Radio } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import ExamSet from 'classes/ExamSet';
import { ReduxState } from 'redux/reducers';
import Selection from 'classes/Selection';
import SetRadioButtonMetadata from './SetRadioButtonMetadata';
import QuestionHadHelpLabel from 'components/Question/QuestionMetadata/QuestionHadHelpLabel';

export interface SetRadioButtonProps {
  set: ExamSet;
}

const SetRadioButton: React.SFC<SetRadioButtonProps> = ({ set }) => {
  const user = useSelector((state: ReduxState) => state.auth.user);
  const chosenSetId = useSelector((state: ReduxState) => state.selection.examSetId);

  const handleChange = async (examSetId: number) => {
    Selection.change({ type: 'examSetId', value: examSetId });
  };

  const translateSeason = (season: ExamSet['season'], activeLanguage: { code: string }) => {
    const isEnglish = activeLanguage.code === 'gb';

    if (season.match(/F/)) {
      if (isEnglish) {
        return 'Spring';
      }
      return 'Forår';
    }
    if (season.match(/E/)) {
      if (isEnglish) {
        return 'Autumn';
      }
      return 'Efterår';
    }
  };

  const radioName = (activeLanguage: { code: string }) => {
    if (set.name) {
      return set.name;
    }
    return `${translateSeason(set.season, activeLanguage)} ${set.year} ${
      set.reexam ? (activeLanguage.code === 'gb' ? 'Re-exam' : 'Reeksamen') : ''
    }`;
  };

  return (
    <Form.Group key={set.id}>
      <Form.Field>
        <Translate>
          {({ activeLanguage = { code: 'dk' } }) => (
            <>
              <Radio
                label={radioName(activeLanguage)}
                checked={set.id === chosenSetId}
                name="selectedSetId"
                onChange={() => handleChange(set.id)}
              />{' '}
              {user && <SetRadioButtonMetadata user={user} examSet={set} />}{' '}
              {!set.name && <QuestionHadHelpLabel hadHelp={set.hadHelp} />}
            </>
          )}
        </Translate>
      </Form.Field>
    </Form.Group>
  );
};

export default SetRadioButton;
