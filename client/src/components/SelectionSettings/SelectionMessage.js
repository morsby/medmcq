import React from 'react';
import PropTypes from 'prop-types';

import { Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

/**
 * Afhængig af valg kan vises en ekstra besked omkring antal af spørgsmål.
 * @param {object} user     Brugeren. Logget ind? Defaults til null.
 * @param {string} type     Hvilken quiz ønskes?
 */
const SelectionMessage = ({ user = null, type }) => {
  if (user && type !== 'set') {
    return (
      <Message info>
        <p>
          <Translate id="selectionMessage.available_lower_than_requested" />
        </p>
      </Message>
    );
  }
  if (!user && type === 'specialer') {
    return (
      <p>
        <Translate id="selectionMessage.specialties_lower_than_requested" />
      </p>
    );
  }
  return null;
};

SelectionMessage.propTypes = {
  user: PropTypes.object,
  type: PropTypes.string.isRequired
};

export default SelectionMessage;
