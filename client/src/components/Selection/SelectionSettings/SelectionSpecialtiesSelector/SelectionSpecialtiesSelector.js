import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';
import LoadingPage from './../../../misc/Utility-pages/LoadingPage';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = ({
  semester = 7,
  valgteSpecialer = [],
  valgteTags = [],
  onChange,
  specialties,
  tags,
  loading
}) => {
  if (loading || !specialties || !tags) return <LoadingPage />;
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
            {specialties.map((s) => {
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={s._id}
                  type="specialer"
                  speciale={s}
                  erValgt={valgteSpecialer.includes(s._id)}
                  antal={s.count}
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
            {tags.map((t) => {
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={t._id}
                  type="tags"
                  speciale={t}
                  erValgt={valgteTags.includes(t._id)}
                  antal={t.count}
                  onChange={onChange}
                />
              );
            })}
          </Grid.Row>
        </Grid.Column>
      </Grid>

      <Message info>
        <Translate id="selectionSpecialtiesSelector.tags_explanation" />
      </Message>
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
