import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

/**
 * Component der giver mulighed for at vælge om der ønskes kun nye spørgsmål.
 */
const SelectionUniqueSelector = ({ onlyNew, onChange }) => (
    <div>
        <Translate>
            {({ translate }) => (
                <Checkbox
                    name="onlyNew"
                    checked={onlyNew}
                    onClick={onChange}
                    label={translate('selectionUniqueSelector.label')}
                />
            )}
        </Translate>
        <Divider hidden />
    </div>
);

SelectionUniqueSelector.propTypes = {
    /**
     * Ønskes der kun nye?
     */
    onlyNew: PropTypes.bool,

    /**
     * Func der ændrer værdien af checkbox
     */
    onChange: PropTypes.func,
};

export default SelectionUniqueSelector;
