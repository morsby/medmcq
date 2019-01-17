import React from "react";
import PropTypes from "prop-types";

import { Form, Radio, Checkbox, Divider, Header } from "semantic-ui-react";

const SelectionNSelector = ({ n, onChange, total, onlyNew, user }) => {
    return (
        <Form>
            <Header as="h3">Hvor mange spørgsmål vil du have?</Header>
            <Form.Group>
                <Form.Field>
                    <Radio
                        label="5"
                        value={5}
                        name="n"
                        checked={n === 5}
                        onChange={onChange}
                    />
                    <Divider vertical hidden />
                </Form.Field>

                <Form.Field>
                    <Radio
                        label="10"
                        value={10}
                        name="n"
                        checked={n === 10}
                        onChange={onChange}
                        width={2}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label="20"
                        value={20}
                        name="n"
                        checked={n === 20}
                        onChange={onChange}
                        width={3}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label="40"
                        value={40}
                        name="n"
                        checked={n === 40}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label="80"
                        value={80}
                        name="n"
                        checked={n === 80}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <input
                        label="Anden værdi"
                        name="n"
                        type='text'
                        value={n}
                        onChange={onChange}
                    />
                </Form.Field>
            </Form.Group>

            <div>Der er {total} spørgsmål for det valgte semester.</div>
            <Divider hidden />

            {user && (
                <div>
                    <Checkbox
                        name="onlyNew"
                        checked={onlyNew}
                        onClick={onChange}
                        label="Giv mig kun spørgsmål, jeg ikke har svaret på tidligere"
                    />
                    <Divider hidden />
                </div>
            )}
        </Form>
    );
};

SelectionNSelector.propTypes = {
    n: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onlyNew: PropTypes.bool,
    user: PropTypes.object
};

export default SelectionNSelector;
