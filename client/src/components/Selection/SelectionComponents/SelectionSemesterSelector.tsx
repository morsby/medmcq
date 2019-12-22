import React from 'react';
import { Header, Dropdown } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import uiReducer from 'redux/reducers/ui';
import { Translate } from 'react-localize-redux';

export interface SelectionSemesterSelectorProps {}

const SelectionSemesterSelector: React.SFC<SelectionSemesterSelectorProps> = () => {
  const dispatch = useDispatch();
  const selectedSemester = useSelector((state: ReduxState) => state.ui.selection.semesterId);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const mappedSemesters = semesters.map((semester) => ({
    text: `${semester.value}. semester - ${semester.name}`,
    value: semester.id,
    key: semester.id
  }));

  const handleChange = (value: number) => {
    dispatch(uiReducer.actions.changeSelection({ type: 'semesterId', value }));
  };

  return (
    <Translate>
      {({ translate }) => (
        <>
          <Header as="h3">{translate('selection.static.choose_semester')}</Header>
          <Dropdown
            placeholder={translate('selection.static.choose_semester') as string}
            fluid
            selection
            options={mappedSemesters}
            value={selectedSemester}
            onChange={(e, { value }) => handleChange(value as number)}
          />
        </>
      )}
    </Translate>
  );
};

export default SelectionSemesterSelector;
