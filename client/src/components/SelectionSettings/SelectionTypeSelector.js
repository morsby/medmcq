import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

const SelectionTypeSelector = props => {
    return (
        <Button.Group fluid widths={3}>
            <Button
                name="type"
                value="random"
                active={props.type === 'random'}
                onClick={props.handleClick}
            >
                Tilfældige spørgsmål
            </Button>

            <Button
                name="type"
                value="specialer"
                active={props.type === 'specialer'}
                onClick={props.handleClick}
            >
                Specialer
            </Button>
            <Button
                name="type"
                value="set"
                active={props.type === 'set'}
                onClick={props.handleClick}
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
