import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { groupQuestionsBySet } from '../../../../utils/questions';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { getSets } from '../../../../actions';
import LoadingPage from '../../../Misc/Utility-pages/LoadingPage';

const SelectionSetSelector = ({
  semester,
  activeSet,
  sets,
  questions,
  answeredQuestions,
  onChange,
  getSets
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchSets = async () => {
      await getSets(semester);
    };
    fetchSets();
    setLoading(false);
  }, [semester]);

  if (!semester) {
    return (
      <Header as='h3'>
        <Translate id='selectionSetSelector.choose_semester' />
      </Header>
    );
  }
  if (loading) { return <LoadingPage />; }
  return (
    <Form>
      <Header as='h3'>
        <Translate id='selectionSetSelector.header' data={{ semester }} />
      </Header>

      {sets.map((set) => (
        <SetRadioButton
          key={set.api}
          set={set}
          answeredQuestions={answeredQuestions}
          activeSet={activeSet}
          onChange={onChange}
        />
      ))}
    </Form>
  );
};

SelectionSetSelector.propTypes = {
  semester: PropTypes.number,
  activeSet: PropTypes.string,
  sets: PropTypes.array,
  questions: PropTypes.array,
  answeredQuestions: PropTypes.object,
  onChange: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    sets: state.settings.sets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSets: (semester) => dispatch(getSets(semester))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionSetSelector);
