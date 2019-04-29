import React from 'react';
import PropTypes from 'prop-types';

import { Header, Dropdown } from 'semantic-ui-react';

const SelectionSemesterSelector = ({ label, name, semesters, selectedSemester, handleChange }) => (
  <>
    <Header as="h3">{label}</Header>
    <Dropdown
      placeholder={label}
      fluid
      selection
      options={semesters}
      name="selectedSemester"
      value={selectedSemester}
      onChange={handleChange}
    />
  </>
);

export default SelectionSemesterSelector;
