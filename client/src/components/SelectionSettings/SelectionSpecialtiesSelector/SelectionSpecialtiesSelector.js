import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'actions';

import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = ({ selection, metadata, changeSelection }) => {
  const { selectedSemester, selectedSpecialtyIds, selectedTagIds } = selection;
  const semester = metadata.entities.semesters[selectedSemester];

  const onChange = (e, { value, name }) => {
    changeSelection(name, value);
  };

  if (!selectedSemester) {
    return (
      <Header as="h3">
        <Translate id="selectionSpecialtiesSelector.choose_semester" />
      </Header>
    );
  }
  return (
    <Form>
      <Grid columns="equal" stackable>
        <Grid.Column>
          <Grid.Row>
            <Header as="h3">
              <Translate
                id="selectionSpecialtiesSelector.header"
                data={{ semester: semester.value }}
              />
            </Header>
            {semester.specialties.map((specialtyId) => {
              let speciale = metadata.entities.specialties[specialtyId];
              let erValgt = selectedSpecialtyIds.includes(speciale.id);
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={speciale.id}
                  type="selectedSpecialtyIds"
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
            <Header as="h3">
              <Translate
                id="selectionSpecialtiesSelector.tags"
                data={{ semester: semester.value }}
              />
            </Header>
            {semester.tags.map((tagId) => {
              let tag = metadata.entities.tags[tagId];
              let erValgt = selectedTagIds.includes(tag.id);
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={tag.id}
                  type="selectedTagIds"
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
        <Translate id="selectionSpecialtiesSelector.tags_explanation" />
      </Message>
    </Form>
  );
};

SelectionSpecialtiesSelector.propTypes = {
  metadata: PropTypes.object,
  selection: PropTypes.object,
  changeSelection: PropTypes.func
};

const mapStateToProps = (state) => ({ metadata: state.metadata, selection: state.ui.selection });

export default connect(
  mapStateToProps,
  actions
)(SelectionSpecialtiesSelector);
