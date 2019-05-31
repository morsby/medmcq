import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { allowedNs } from 'utils/common';

import styles from './SelectionNSelector.module.css';

import { Translate } from 'react-localize-redux';

import { Label, Input, Form, Radio, Header, Grid } from 'semantic-ui-react';

/**
 * Component der giver mulighed for ændring af antal ønskede spørgsmål.
 * Alle props kommer fra ../Selection.js
 */
class SelectionNSelector extends Component {
  render() {
    const { onChange, n } = this.props;

    let labelError;

    if (n > allowedNs.max || n < allowedNs.min) {
      labelError = (
        <Label basic color="red" pointing>
          <Translate
            id="selectionNSelector.err_n_range"
            data={{ min: allowedNs.min, max: allowedNs.max }}
          />
        </Label>
      );
    }

    return (
      <Form>
        <Header as="h3">
          <Translate id="selectionNSelector.header" />
        </Header>
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
                  <Translate>
                    {({ translate }) => (
                      <>
                        <Input
                          fluid
                          label={translate('selectionNSelector.other_value')}
                          name="n"
                          type="number"
                          min="1"
                          value={n}
                          labelPosition="left"
                          onChange={onChange}
                        />
                        {labelError}
                      </>
                    )}
                  </Translate>
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Form>
    );
  }
}

SelectionNSelector.propTypes = {
  /**
   * Aktuelt ønskede antal.
   */
  n: PropTypes.number.isRequired,

  /**
   * Func der ændrer det ønskede antal
   */
  onChange: PropTypes.func.isRequired
};

export default SelectionNSelector;
