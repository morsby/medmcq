import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

export interface SelectionUniqueSelectorProps {
  onlyNew: boolean;
  onlyWrong: boolean;
  onChange: () => void;
}

/**
 * Component der giver mulighed for at vælge om der ønskes kun nye spørgsmål.
 */
const SelectionUniqueSelector: React.SFC<SelectionUniqueSelectorProps> = ({
  onlyNew,
  onlyWrong,
  onChange
}) => {
  return (
    <>
      <Translate>
        {({ translate }) => (
          <>
            <Checkbox
              style={{ marginLeft: '1rem' }}
              name="onlyNew"
              checked={onlyNew}
              onClick={onChange}
              label={translate('selectionUniqueSelector.label')}
            />
            <br />
            <Checkbox
              style={{ marginLeft: '1rem' }}
              name="onlyWrong"
              checked={onlyWrong}
              onClick={onChange}
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
