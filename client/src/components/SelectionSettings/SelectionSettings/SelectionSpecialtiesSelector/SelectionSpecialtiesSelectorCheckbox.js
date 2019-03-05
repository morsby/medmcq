import React from 'react';
import PropTypes from 'prop-types';

import { Form, Checkbox, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

/**
 * Component der viser checkboxes for hvert speciale.
 * Alle prps fra SelectionSpecialtiesSelector.js
 */
const SelectionSpecialtiesSelectorCheckbox = ({
    speciale,
    erValgt,
    antalPerSpeciale,
    onChange,
}) => {
    let antal = antalPerSpeciale === undefined ? 0 : antalPerSpeciale;
    return (
        <Form.Group key={speciale.value}>
            <Form.Field>
                <Translate>
                    {({ activeLanguage }) => (
                        <>
                            <Checkbox
                                label={`${speciale.text} (${antal} ${
                                    activeLanguage === 'dk'
                                        ? 'spørgsmål'
                                        : 'questions'
                                })`}
                                value={speciale.value}
                                checked={erValgt}
                                name="specialer"
                                onChange={onChange}
                            />
                            <Divider vertical hidden />
                        </>
                    )}
                </Translate>
            </Form.Field>
        </Form.Group>
    );
};

SelectionSpecialtiesSelectorCheckbox.propTypes = {
    /**
     * Speciale-objekt af form: {"text": "Navn", "value": "slug"}
     */
    speciale: PropTypes.object,

    /**
     * Boolean. Er specialet allerede valgt?
     */
    erValgt: PropTypes.bool,

    /**
     * Hvor mange spg. per speciale?
     */
    antalPerSpeciale: PropTypes.number,

    /**
     * Func der ændrer valgene.
     */
    onChange: PropTypes.func,
};

export default SelectionSpecialtiesSelectorCheckbox;