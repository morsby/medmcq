import React from 'react';
import PropTypes from 'prop-types';

import { Form, Radio, Divider } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

const SetRadioButton = ({ set, selectedSet, onChange }) => {
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
                  name='selectedSetId'
                  onChange={onChange}
                />
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
  onChange: PropTypes.func
};

export default SetRadioButton;
