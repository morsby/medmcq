import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

const SelectionTypeSelector = ({ type, handleClick }) => {
    return (
        <Button.Group fluid widths={3}>
            <Button
                name="type"
                value="random"
                active={type === 'random'}
                onClick={handleClick}
            >
                Tilfældige spørgsmål
            </Button>

            <Button
                name="type"
                value="specialer"
                active={type === 'specialer'}
                onClick={handleClick}
            >
                Specialer
            </Button>
            <Button
                name="type"
                value="set"
                active={type === 'set'}
                onClick={handleClick}
            >
                Fulde eksamenssæt
            </Button>
        </Button.Group>
    );
};

SelectionTypeSelector.propTypes = {
    type: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
};

export default SelectionTypeSelector;
