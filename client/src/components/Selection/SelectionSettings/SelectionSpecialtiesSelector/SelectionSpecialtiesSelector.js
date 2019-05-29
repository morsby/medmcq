import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import SelectionSpecialtiesSelectorCheckbox from './SelectionSpecialtiesSelectorCheckbox';
import LoadingPage from './../../../Misc/Utility-pages/LoadingPage';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchMetadata } from './../../../../actions/settings';

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
  fetchMetadata,
  lastMetadataFetch
}) => {
  const [loading, setLoading] = useState(false);

  const getMetadata = async () => {
    setLoading(true);
    await fetchMetadata(semester);
    setLoading(false);
  };

  useEffect(() => {
    if (
      specialties.length === 0 ||
      tags.length === 0 ||
      Date.now() - lastMetadataFetch > 3.6 * Math.pow(10, 6)
    ) {
      getMetadata();
    }
  }, []);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    getMetadata();
  }, [semester]);

  const tagsList = () => {
    let tagCategories = {};
    let returned = [];

    for (let t of _.sortBy(tags, (t) => t.category)) {
      if (!tagCategories[t.category]) tagCategories[t.category] = [];
      tagCategories[t.category].push(
        <SelectionSpecialtiesSelectorCheckbox
          key={t._id}
          type="tags"
          speciale={t}
          erValgt={valgteTags.includes(t._id)}
          antal={t.count}
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

  tagsList();

  if (loading || !specialties || !tags) return <LoadingPage />;
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
            {tagsList()}
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
   * Hvilke tags er valgt?
   */
  valgteTags: PropTypes.array,

  /**
   * onChange
   * @type {[type]}
   */
  onChange: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    semester: state.settings.semester,
    valgteTags: state.settings.tags,
    valgteSpecialer: state.settings.specialer,
    specialties: state.settings.metadata.specialties,
    tags: state.settings.metadata.tags,
    lastMetadataFetch: state.settings.metadata.date
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMetadata: (semester) => dispatch(fetchMetadata(semester))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionSpecialtiesSelector);
