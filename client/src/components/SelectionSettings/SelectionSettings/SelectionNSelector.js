import React from 'react';
import PropTypes from 'prop-types';
import styles from './SelectionNSelector.module.css';

import {
    Label,
    Input,
    Form,
    Radio,
    Checkbox,
    Divider,
    Header,
    Grid,
} from 'semantic-ui-react';

const SelectionNSelector = ({ n, onChange, total, onlyNew, user }) => {
    let labelError;

    if (n > 1000 || n < 1) {
        labelError = (
            <Label basic color="red" pointing>
                Værdi skal være mellem 1 og 300
            </Label>
        );
    }

    return (
        <Form>
            <Header as="h3">Hvor mange spørgsmål vil du have?</Header>
            <div>
                <Grid verticalAlign="top">
                    <Grid.Row>
                        <Grid.Column
                            computer={1}
                            tablet={2}
                            mobile={3}
                            className={styles.height38}
                        >
                            <Form.Field>
                                <Radio
                                    label="5"
                                    value={5}
                                    name="n"
                                    checked={n === 5}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                            computer={1}
                            tablet={2}
                            mobile={3}
                            className={styles.height38}
                        >
                            <Form.Field>
                                <Radio
                                    label="10"
                                    value={10}
                                    name="n"
                                    checked={n === 10}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                            computer={1}
                            tablet={2}
                            mobile={3}
                            className={styles.height38}
                        >
                            <Form.Field>
                                <Radio
                                    label="20"
                                    value={20}
                                    name="n"
                                    checked={n === 20}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                            computer={1}
                            tablet={2}
                            mobile={3}
                            className={styles.height38}
                        >
                            <Form.Field>
                                <Radio
                                    label="40"
                                    value={40}
                                    name="n"
                                    checked={n === 40}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                            computer={1}
                            tablet={2}
                            mobile={3}
                            className={styles.height38}
                        >
                            <Form.Field>
                                <Radio
                                    label="80"
                                    value={80}
                                    name="n"
                                    checked={n === 80}
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                            computer={4}
                            tablet={6}
                            mobile={16}
                            textAlign="center"
                        >
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Anden værdi"
                                    name="n"
                                    type="number"
                                    min="1"
                                    value={n}
                                    labelPosition="left"
                                    onChange={onChange}
                                />
                                {labelError}
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

            <Divider hidden />
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
    user: PropTypes.object,
};

export default SelectionNSelector;
