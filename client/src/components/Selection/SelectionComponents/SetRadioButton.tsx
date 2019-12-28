import React, { useState } from 'react';

import _ from 'lodash';

import { Form, Radio, Divider, Icon, Loader } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import User from 'classes/User';
import ExamSet from 'classes/ExamSet';
import { ReduxState } from 'redux/reducers';
import UIReducer from 'redux/reducers/ui';

export interface SetRadioButtonProps {
  set: ExamSet;
}

const SetRadioButton: React.SFC<SetRadioButtonProps> = ({ set }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: ReduxState) => state.auth.user);
  const chosenSetId = useSelector((state: ReduxState) => state.ui.selection.setId);
  const [manualLoading, setManualLoading] = useState(false);

  const handleManualCompletion = async () => {
    setManualLoading(true);
    await User.manualCompleteSet({ setId: set.id });
    setManualLoading(false);
  };

  const handleChange = async (setId: number) => {
    await dispatch(UIReducer.actions.changeSelection({ type: 'setId', value: setId }));
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
                {user && !manualLoading && (
                  <Icon
                    name="check"
                    onClick={handleManualCompletion}
                    style={{ cursor: 'pointer' }}
                    color={_.find(user.manualCompletedSets, { id: set.id }) ? 'orange' : 'grey'}
                  />
                )}
                {manualLoading && <Loader active inline size="mini" />}
                <Divider vertical hidden />
              </>
            );
          }}
        </Translate>
      </Form.Field>
    </Form.Group>
  );
};

export default SetRadioButton;
