import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Form, Radio, Divider, Icon } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { manualCompleteSet } from 'actions/auth';

const SetRadioButton = ({
  set,
  onChange,
  completedSetsCount,
  selectedSet,
  user,
  api,
  manualCompleteSet,
  semester
}) => {
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
                {<Icon name="check" color={!completedSetsCount && user ? 'green' : 'grey'} />}
                {user && (
                  <Icon
                    name="check"
                    onClick={() => manualCompleteSet(api, user, semester)}
                    style={{ cursor: 'pointer' }}
                    color={
                      _.indexOf((user.completedSets || {})[semester] || [], api) !== -1
                        ? 'orange'
                        : 'grey'
                    }
                  />
                )}
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

const mapDispatchToProps = (dispatch) => {
  return {
    manualCompleteSet: (api, user, semester) => dispatch(manualCompleteSet(api, user, semester))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SetRadioButton);
