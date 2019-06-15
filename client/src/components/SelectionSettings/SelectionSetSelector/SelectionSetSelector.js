import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'actions';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

const SelectionSetSelector = ({ metadata, selection, changeSelection }) => {
  const { selectedSemester, selectedSetId } = selection;
  const semester = metadata.entities.semesters[selectedSemester];
  const onChange = (e, { name, value }) => {
    changeSelection(name, value);
  };

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
        <Translate id="selectionSetSelector.header" data={{ semester: semester.value }} />
      </Header>

      {semester.examSets.map((setId) => {
        let set = metadata.entities.examSets[setId];
        return (
          <SetRadioButton key={set.id} set={set} selectedSet={selectedSetId} onChange={onChange} />
        );
      })}
    </Form>
  );
};

SelectionSetSelector.propTypes = {
  metadata: PropTypes.object,
  selection: PropTypes.object,
  changeSelection: PropTypes.func
};

const mapStateToProps = (state) => ({ metadata: state.metadata, selection: state.ui.selection });

export default connect(
  mapStateToProps,
  actions
)(SelectionSetSelector);
