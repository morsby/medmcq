import React from 'react';
import { Checkbox, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Selection from 'classes/Selection';

export interface SelectionUniqueSelectorProps {}

/**
 * Component der giver mulighed for at vælge om der ønskes kun nye spørgsmål.
 */
const SelectionUniqueSelector: React.SFC<SelectionUniqueSelectorProps> = () => {
  const { onlyNew, onlyWrong } = useSelector((state: ReduxState) => state.selection);

  const handleChange = (checked: boolean, type: 'onlyNew' | 'onlyWrong') => {
    Selection.change({ type, value: checked });
  };

  return (
    <>
      <Translate>
        {({ translate }) => (
          <>
            <Checkbox
              style={{ marginLeft: '1rem' }}
              checked={onlyNew}
              onClick={(e, { checked }) => handleChange(checked, 'onlyNew')}
              label={translate('selectionUniqueSelector.label')}
            />
            <br />
            <Checkbox
              style={{ marginLeft: '1rem' }}
              checked={onlyWrong}
              onClick={(e, { checked }) => handleChange(checked, 'onlyWrong')}
              label={translate('selectionWrongSelector.label')}
            />
          </>
        )}
      </Translate>
      <Divider hidden />
    </>
  );
};

export default SelectionUniqueSelector;