import React from 'react';

import { Button } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import UIReducer from 'redux/reducers/ui';

/**
 * Buttons der tillader ændring af quiz-typen.
 */
export interface SelectionTypeSelectorProps {}

const SelectionTypeSelector: React.SFC<SelectionTypeSelectorProps> = () => {
  const dispatch = useDispatch();
  const type = useSelector((state: ReduxState) => state.ui.selection.type);

  const handleChange = (value: string) => {
    dispatch(UIReducer.actions.changeSelection({ type: 'type', value }));
  };

  return (
    <Button.Group fluid widths={3}>
      <Button
        value="random"
        active={type === 'random'}
        onClick={(e) => handleChange(e.currentTarget.value)}
      >
        <Translate id="selectionTypeSelector.types.random" />
      </Button>

      <Button
        value="specialer"
        active={type === 'specialer'}
        onClick={(e) => handleChange(e.currentTarget.value)}
      >
        <Translate id="selectionTypeSelector.types.specialties" />
      </Button>
      <Button
        value="set"
        active={type === 'set'}
        onClick={(e) => handleChange(e.currentTarget.value)}
      >
        <Translate id="selectionTypeSelector.types.sets" />
      </Button>
    </Button.Group>
  );
};

export default SelectionTypeSelector;
