import React from 'react';
import PropTypes from 'prop-types';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

const SelectionSetSelector = ({ semester, selectedSet, onChange }) => {
  if (!semester) {
    return (
      <Header as="h3">
        <Translate id="selectionSetSelector.choose_semester" />
      </Header>
    );
  }
  return (
    <Form>
      <Header as="h3">
        <Translate
          id="selectionSetSelector.header"
          data={{ semester: semester.value }}
        />
      </Header>

      {semester.examSets.map(set => (
        <SetRadioButton
          key={set.id}
          set={set}
          selectedSet={selectedSet}
          onChange={onChange}
        />
      ))}
    </Form>
  );
};

SelectionSetSelector.propTypes = {
  semester: PropTypes.object,
  selectedSet: PropTypes.number,
  onChange: PropTypes.func
};

export default SelectionSetSelector;
