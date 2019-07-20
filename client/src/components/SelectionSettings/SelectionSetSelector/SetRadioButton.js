import React, { useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Form, Radio, Divider, Icon, Loader } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { manualCompleteSet } from 'actions/auth';
import { useDispatch, useSelector } from 'react-redux';

const SetRadioButton = ({ set, onChange, selectedSet }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [manualLoading, setManualLoading] = useState(false);

  const handleManualCompletion = async () => {
    setManualLoading(true);
    await dispatch(manualCompleteSet(set.id, user.id));
    setManualLoading(false);
  };

  return (
    <Form.Group key={set.api}>
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
                  value={set.id}
                  checked={set.id === selectedSet}
                  name="selectedSetId"
                  onChange={onChange}
                />{' '}
                {
                  // TODO: Udregn færdiggjorte sæt
                }
                {<Icon name="check" color="grey" />}
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

SetRadioButton.propTypes = {
  set: PropTypes.object,
  answeredQuestions: PropTypes.object,
  groupedQuestions: PropTypes.array,
  selectedSet: PropTypes.number,
  onChange: PropTypes.func,

  // Ryd op:
  completedSetsCount: PropTypes.bool,
  user: PropTypes.object,
  api: PropTypes.string,
  manualCompleteSet: PropTypes.func,
  semester: PropTypes.string
};

export default SetRadioButton;
