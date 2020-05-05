import React, { useState } from 'react';

import { allowedNs } from 'utils/common';

import styles from './SelectionNSelector.module.css';

import { Translate } from 'react-localize-redux';

import { Label, Input, Form, Radio, Header, Grid } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Selection from 'classes/Selection';
const radioOptions = [5, 10, 20, 40, 80];

/**
 * Component der giver mulighed for ændring af antal ønskede spørgsmål.
 * Alle props kommer fra ../Selection.js
 */
export interface SelectionNSelectorProps {}

const SelectionNSelector: React.SFC<SelectionNSelectorProps> = () => {
  const [error, setError] = useState(false);
  const n = useSelector((state: ReduxState) => state.selection.n);

  const handleChange = (value: number) => {
    if (value > 100) {
      setError(true);
      value = 100;
    } else {
      setError(false);
    }
    Selection.change({ type: 'n', value });
  };

  return (
    <Form>
      <Header as="h3">
        <Translate id="selectionNSelector.header" />
      </Header>
      <div>
        <Grid verticalAlign="top">
          <Grid.Row>
            {radioOptions.map((option) => (
              <Grid.Column
                key={option}
                computer={1}
                tablet={2}
                mobile={3}
                className={styles.height38}
              >
                <Form.Field>
                  <Radio
                    label={option}
                    value={option}
                    name="n"
                    checked={n === option}
                    onChange={(e, { value }) => handleChange(value as number)}
                  />
                </Form.Field>
              </Grid.Column>
            ))}
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
                        value={n}
                        labelPosition="left"
                        onChange={(e) => handleChange(Number(e.target.value))}
                      />
                      {error && (
                        <Label basic color="red" pointing>
                          <Translate
                            id="selectionNSelector.err_n_range"
                            data={{ min: allowedNs.min, max: allowedNs.max }}
                          />
                        </Label>
                      )}
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
