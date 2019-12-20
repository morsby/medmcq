import React from 'react';

import { allowedNs } from 'utils/common';

import styles from './SelectionNSelector.module.css';

import { Translate } from 'react-localize-redux';

import { Label, Input, Form, Radio, Header, Grid } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import UIReducer from 'redux/reducers/ui';

/**
 * Component der giver mulighed for ændring af antal ønskede spørgsmål.
 * Alle props kommer fra ../Selection.js
 */
export interface SelectionNSelectorProps {}

const SelectionNSelector: React.SFC<SelectionNSelectorProps> = () => {
  const dispatch = useDispatch();
  const n = useSelector((state: ReduxState) => state.ui.selection.n);

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

  const handleChange = (value: number) => {
    dispatch(UIReducer.actions.changeSelection({ type: 'n', value }));
  };

  return (
    <Form>
      <Header as="h3">
        <Translate id="selectionNSelector.header" />
      </Header>
      <div>
        <Grid verticalAlign="top">
          <Grid.Row>
            <Grid.Column computer={1} tablet={2} mobile={3} className={styles.height38}>
              <Form.Field>
                <Radio
                  label="5"
                  value={5}
                  name="n"
                  checked={n === 5}
                  onChange={(e, { value }) => handleChange(value as number)}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column computer={1} tablet={2} mobile={3} className={styles.height38}>
              <Form.Field>
                <Radio
                  label="10"
                  value={10}
                  name="n"
                  checked={n === 10}
                  onChange={(e, { value }) => handleChange(value as number)}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column computer={1} tablet={2} mobile={3} className={styles.height38}>
              <Form.Field>
                <Radio
                  label="20"
                  value={20}
                  name="n"
                  checked={n === 20}
                  onChange={(e, { value }) => handleChange(value as number)}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column computer={1} tablet={2} mobile={3} className={styles.height38}>
              <Form.Field>
                <Radio
                  label="40"
                  value={40}
                  name="n"
                  checked={n === 40}
                  onChange={(e, { value }) => handleChange(value as number)}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column computer={1} tablet={2} mobile={3} className={styles.height38}>
              <Form.Field>
                <Radio
                  label="80"
                  value={80}
                  name="n"
                  checked={n === 80}
                  onChange={(e, { value }) => handleChange(value as number)}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column computer={4} tablet={6} mobile={16} textAlign="center">
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
                        onChange={(e, { value }) => handleChange(Number(value))}
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
};

export default SelectionNSelector;
