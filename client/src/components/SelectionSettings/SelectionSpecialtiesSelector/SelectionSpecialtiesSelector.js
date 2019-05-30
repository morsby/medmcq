import React from 'react';
import PropTypes from 'prop-types';

import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = ({
  semester = {},
  valgteSpecialer = [],
  valgteTags = [],
  onChange
}) => {
  if (!semester) {
    return (
      <Header as='h3'>
        <Translate id='selectionSpecialtiesSelector.choose_semester' />
      </Header>
    );
  }
  return (
    <Form>
      <Grid columns='equal' stackable>
        <Grid.Column>
          <Grid.Row>
            <Header as='h3'>
              <Translate
                id='selectionSpecialtiesSelector.header'
                data={{ semester: semester.value }}
              />
            </Header>
            {semester.specialties.map((speciale) => {
              let erValgt = valgteSpecialer.includes(speciale.id);
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={speciale.id}
                  type='selectedSpecialtyIds'
                  speciale={speciale}
                  erValgt={erValgt}
                  onChange={onChange}
                />
              );
            })}
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row>
            <Header as='h3'>
              <Translate
                id='selectionSpecialtiesSelector.tags'
                data={{ semester: semester.value }}
              />
            </Header>
            {semester.tags.map((tag) => {
              let erValgt = valgteTags.includes(tag.id);
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={tag.id}
                  type='selectedTagIds'
                  speciale={tag}
                  erValgt={erValgt}
                  onChange={onChange}
                />
              );
            })}
          </Grid.Row>
        </Grid.Column>
      </Grid>

      <Message info>
        <Translate id='selectionSpecialtiesSelector.tags_explanation' />
      </Message>
    </Form>
  );
};

SelectionSpecialtiesSelector.propTypes = {
  /**
   * Det aktuelle semester.
   */
  semester: PropTypes.object,

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
