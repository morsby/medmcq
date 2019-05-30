import React from 'react';
import PropTypes from 'prop-types';

import { Header, Dropdown } from 'semantic-ui-react';

const SelectionSemesterSelector = ({ label, semesters, selectedSemester, handleChange }) => (
  <>
    <Header as='h3'>{label}</Header>
    <Dropdown
      placeholder={label}
      fluid
      selection
      options={semesters}
      name='selectedSemester'
      value={selectedSemester}
      onChange={handleChange}
    />
  </>
);

SelectionSemesterSelector.propTypes = {
  label: PropTypes.string,
  semesters: PropTypes.array,
  selectedSemester: PropTypes.number,
  handleChange: PropTypes.func
};

export default SelectionSemesterSelector;
