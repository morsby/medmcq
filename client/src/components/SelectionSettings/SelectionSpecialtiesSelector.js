import React from 'react';
import PropTypes from 'prop-types';

import { Form, Checkbox, Divider, Header } from 'semantic-ui-react';

import { specialer } from '../../utils/common';

const checkboxGenerator = (speciale, erValgt, antalSpg, onChange) => {
    let antal = antalSpg === undefined ? 0 : antalSpg;
    return (
        <Form.Group key={speciale.value}>
            <Form.Field>
                <Checkbox
                    label={`${speciale.text} (${antal} spørgsmål)`}
                    value={speciale.value}
                    checked={erValgt}
                    name="specialer"
                    onChange={onChange}
                />
                <Divider vertical hidden />
            </Form.Field>
        </Form.Group>
    );
};

const SelectionSpecialtiesSelector = ({
    semester = 7,
    valgteSpecialer = [],
    onChange,
    questions = [],
    antalPerSpeciale = [],
}) => {
    if (!semester)
        return (
            <Header as="h3">
                Vælg et semester for at se tilgængelige specialer
            </Header>
        );
    return (
        <Form>
            <Header as="h3">
                For {semester}. semester er der følgende specialer at vælge
                mellem:
            </Header>

            {specialer[semester].map(speciale => {
                let erValgt = valgteSpecialer.includes(speciale.value);
                return checkboxGenerator(
                    speciale,
                    erValgt,
                    antalPerSpeciale[speciale.value],
                    onChange
                );
            })}
        </Form>
    );
};

SelectionSpecialtiesSelector.propTypes = {
    semester: PropTypes.number,
    valgteSpecialer: PropTypes.array,
    onChange: PropTypes.func,
};

export default SelectionSpecialtiesSelector;
