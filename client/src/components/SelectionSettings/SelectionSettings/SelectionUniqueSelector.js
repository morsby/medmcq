import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Divider } from 'semantic-ui-react';

/**
 * Component der giver mulighed for at vælge om der ønskes kun nye spørgsmål.
 */
const SelectionUniqueSelector = ({ onlyNew, onChange }) => (
    <div>
        <Checkbox
            name="onlyNew"
            checked={onlyNew}
            onClick={onChange}
            label="Giv mig kun spørgsmål, jeg ikke har svaret på tidligere"
        />
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
