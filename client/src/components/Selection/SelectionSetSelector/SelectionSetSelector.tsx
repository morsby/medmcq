import React from 'react';
import _ from 'lodash';
import { IReduxState } from 'reducers';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from 'actions';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { ReduxState } from 'redux/reducers';

const SelectionSetSelector = () => {
  const dispatch = useDispatch();
  const { selectedSemester, selectedSetId } = useSelector(
    (state: ReduxState) => state.ui.selection
  );
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === selectedSemester)
  );
  const examSets = useSelector((state: ReduxState) => state.metadata.examSets);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const onChange = (e, { name, value }) => {
    dispatch(actions.changeSelection(name, value));
  };

  if (!selectedSemester) {
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
      {user && (
        <p>
          <Translate id="selectionSetSelector.subtitle" />
        </p>
      )}

      {_(examSets)
        .sortBy((examSet) => examSet.year)
        .reverse()
        .value()
        .map((examSet) => {
          return (
            <SetRadioButton
              key={examSet.id}
              set={examSet}
              selectedSet={selectedSetId}
              onChange={onChange}
            />
          );
        })}
    </Form>
  );
};

export default SelectionSetSelector;
