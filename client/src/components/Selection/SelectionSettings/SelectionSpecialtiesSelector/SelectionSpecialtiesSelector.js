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
  tags
}) => {
  const createSpecialtiesList = () => {
    let specialtiesList = [];

    for (let key in specialties) {
      let erValgt = valgteSpecialer.includes(key);
      specialtiesList.push(
        <SelectionSpecialtiesSelectorCheckbox
          key={key}
          type="specialer"
          speciale={key}
          erValgt={erValgt}
          antal={specialties[key]}
          onChange={onChange}
        />
      );
    }

    return specialtiesList;
  };

  const createTagList = () => {
    let tagsList = [];

    for (let key in tags) {
      let erValgt = valgteTags.includes(key);
      tagsList.push(
        <SelectionSpecialtiesSelectorCheckbox
          key={key}
          type="tags"
          speciale={key}
          erValgt={erValgt}
          antal={tags[key]}
          onChange={onChange}
        />
      );
    }

    return tagsList;
  };

  if (!specialties || !tags) return <LoadingPage />;
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
            {createSpecialtiesList()}
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row>
            <Header as="h3">
              <Translate id="selectionSpecialtiesSelector.tags" data={{ semester }} />
            </Header>
            {createTagList()}
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
