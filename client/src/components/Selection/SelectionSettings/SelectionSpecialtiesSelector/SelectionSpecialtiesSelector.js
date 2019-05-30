import React from 'react';
import PropTypes from 'prop-types';

import { specialer, tags } from '../../../../utils/common';
import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';
import _ from 'lodash';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = React.memo(
  ({
    semester = 7,
    valgteSpecialer = [],
    valgteTags = [],
    onChange,
    antalPerSpeciale,
    antalPerTag
  }) => {
    const tagsList = () => {
      let tagCategories = {};
      let returned = [];

      for (let t of _.sortBy(tags[semester], (t) => t.category)) {
        if (!t.category) continue;
        if (!tagCategories[t.category]) tagCategories[t.category] = [];
        tagCategories[t.category].push(
          <SelectionSpecialtiesSelectorCheckbox
            key={t.value}
            type="tags"
            speciale={t}
            erValgt={valgteTags.includes(t.value)}
            antalPerSpeciale={antalPerTag[t.value]}
            onChange={onChange}
          />
        );
      }

      for (let key in tagCategories) {
        returned.push(
          <React.Fragment key={key}>
            <h5>{key[0].toUpperCase() + key.substring(1)}</h5>
            {tagCategories[key]}
          </React.Fragment>
        );
      }

      return returned;
    };

    if (!semester)
      return (
        <Header as="h3">
          <Translate id="selectionSpecialtiesSelector.choose_semester" />
        </Header>
      );
    return (
      <Form>
        <Grid columns="equal" stackable>
          <Grid.Column>
            <Grid.Row>
              <Header as="h3">
                <Translate id="selectionSpecialtiesSelector.header" data={{ semester }} />
              </Header>
              {specialer[semester].map((speciale) => {
                let erValgt = valgteSpecialer.includes(speciale.value);
                return (
                  <SelectionSpecialtiesSelectorCheckbox
                    key={speciale.value}
                    type="specialer"
                    speciale={speciale}
                    erValgt={erValgt}
                    antalPerSpeciale={antalPerSpeciale[speciale.value]}
                    onChange={onChange}
                  />
                );
              })}
            </Grid.Row>
          </Grid.Column>
          <Grid.Column>
            <Grid.Row>
              <Header as="h3">
                <Translate id="selectionSpecialtiesSelector.tags" data={{ semester }} />
              </Header>
              {tagsList()}
            </Grid.Row>
          </Grid.Column>
        </Grid>

        <Message info>
          <Translate id="selectionSpecialtiesSelector.tags_explanation" />
        </Message>
      </Form>
    );
  }
);

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
   * Hvilke tags er valgt?
   */
  valgteTags: PropTypes.array,

  /**
   * Hvor mange spg findes per tag?
   */
  antalPerTag: PropTypes.object,
  /**
   * onChange
   * @type {[type]}
   */
  onChange: PropTypes.func
};

export default SelectionSpecialtiesSelector;
