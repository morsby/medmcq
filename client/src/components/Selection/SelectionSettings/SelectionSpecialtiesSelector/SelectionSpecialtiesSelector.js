import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';
import axios from 'axios';
import LoadingPage from './../../../misc/Utility-pages/LoadingPage';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = ({
  semester = 7,
  valgteSpecialer = [],
  valgteTags = [],
  onChange
}) => {
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const getMetadata = async () => {
      const { data: metadata } = await axios.get('/api/questions/metadata');
      console.log(metadata);
      const { specialties, tags } = metadata;
      if (!specialties || !tags) return;
      setSpecialties(specialties);
      setTags(tags);
      setLoading(false);
    };

    getMetadata();
  }, []);

  if (loading) return <LoadingPage />;
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
            {_.filter(specialties, { semester: semester }).map((speciale) => {
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
            {_.filter(tags, { semester: semester }).map((tag) => {
              let erValgt = valgteTags.includes(tag.value);
              return (
                <SelectionSpecialtiesSelectorCheckbox
                  key={tag.value}
                  type="tags"
                  speciale={tag}
                  erValgt={erValgt}
                  antalPerSpeciale={antalPerTag[tag.value]}
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
