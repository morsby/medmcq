import React from 'react';
import PropTypes from 'prop-types';

import { specialer } from '../../../../utils/common';
import { Translate } from 'react-localize-redux';

import { Form, Header } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = ({
    semester = 7,
    valgteSpecialer = [],
    onChange,
    antalPerSpeciale,
}) => {
    if (!semester)
        return (
            <Header as="h3">
                <Translate id="selectionSpecialtiesSelector.choose_semester" />
            </Header>
        );
    return (
        <Form>
            <Header as="h3">
                <Translate
                    id="selectionSpecialtiesSelector.header"
                    data={{ semester }}
                />
            </Header>

            {specialer[semester].map(speciale => {
                let erValgt = valgteSpecialer.includes(speciale.value);
                return (
                    <SelectionSpecialtiesSelectorCheckbox
                        key={speciale.value}
                        speciale={speciale}
                        erValgt={erValgt}
                        antalPerSpeciale={antalPerSpeciale[speciale.value]}
                        onChange={onChange}
                    />
                );
            })}
        </Form>
    );
};

SelectionSpecialtiesSelector.propTypes = {
    /**
     * Det aktuelle semester.
     */
    semester: PropTypes.number,

    /**
     * Hvilke specialer er valgt?
     */
    valgteSpecialer: PropTypes.array,

    /**
     * Hvor mange spg findes per speciale?
     */
    antalPerSpeciale: PropTypes.object,
    /**
     * onChange
     * @type {[type]}
     */
    onChange: PropTypes.func,
};

export default SelectionSpecialtiesSelector;
