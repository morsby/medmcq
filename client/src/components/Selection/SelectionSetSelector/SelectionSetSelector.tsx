import React from 'react';
import _ from 'lodash';
import { IReduxState } from 'reducers';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from 'actions';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

const SelectionSetSelector = () => {
  const dispatch = useDispatch();
  const metadata = useSelector((state: IReduxState) => state.metadata);
  const selection = useSelector((state: IReduxState) => state.ui.selection);
  const user = useSelector((state: IReduxState) => state.auth.user);
  const { selectedSemester, selectedSetId } = selection;
  const semester = metadata.entities.semesters[selectedSemester];
  const onChange = (e, { name, value }) => {
    dispatch(actions.changeSelection(name, value));
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
      {user && (
        <p>
          <Translate id="selectionSetSelector.subtitle" />
        </p>
      )}

      {_(semester.examSets)
        .sortBy((setId) => metadata.entities.examSets[setId].year)
        .reverse()
        .value()
        .map((setId) => {
          const set = metadata.entities.examSets[setId];
          return (
            <SetRadioButton
              key={set.id}
              set={set}
              selectedSet={selectedSetId}
              onChange={onChange}
            />
          );
        })}
    </Form>
  );
};

export default SelectionSetSelector;
