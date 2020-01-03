import React from 'react';
import { Form, Radio, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import ExamSet from 'classes/ExamSet';
import { ReduxState } from 'redux/reducers';
import Selection from 'classes/Selection';
import SetRadioButtonMetadata from './SetRadioButtonMetadata';

export interface SetRadioButtonProps {
  set: ExamSet;
}

const SetRadioButton: React.SFC<SetRadioButtonProps> = ({ set }) => {
  const user = useSelector((state: ReduxState) => state.auth.user);
  const chosenSetId = useSelector((state: ReduxState) => state.selection.examSetId);

  const handleChange = async (examSetId: number) => {
    await Selection.change({ type: 'examSetId', value: examSetId });
  };

  return (
    <Form.Group key={set.id}>
      <Form.Field>
        <Translate>
          {({ activeLanguage = { code: 'dk' } }) => {
            // TODO:
            /* flyt evt. disse replaces over i react-localize-redux
                        vha. dynamiske id's (se fx profileAnswerDetails og dets
                        Sæt-kolonne i tabellen) */
            let label = `${set.season} ${set.year}`;
            if (activeLanguage.code === 'gb') {
              label = label.replace('Forår', 'Spring');
              label = label.replace('Efterår', 'Autumn');
              label = label.replace('(reeks)', '(re-ex)');
            }
            return (
              <>
                <Radio
                  label={label}
                  checked={set.id === chosenSetId}
                  name="selectedSetId"
                  onChange={() => handleChange(set.id)}
                />{' '}
                {user && <SetRadioButtonMetadata user={user} examSetId={set.id} />}
              </>
            );
          }}
        </Translate>
      </Form.Field>
    </Form.Group>
  );
};

export default SetRadioButton;
