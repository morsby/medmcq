import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { groupQuestionsBySet } from '../../../../utils/questions';

import SetRadioButton from './SetRadioButton';
import { Form, Header, Divider } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import LoadingPage from '../../../Misc/Utility-pages/LoadingPage';

const SelectionSetSelector = ({
  semester,
  activeSet,
  sets,
  questions,
  answeredQuestions,
  onChange,
  getSets,
  loading
}) => {
  if (!semester) {
    return (
      <Header as="h3">
        <Translate id="selectionSetSelector.choose_semester" />
      </Header>
    );
  }
  if (sets.length === 0 || loading) {
    return (
      <>
        <LoadingPage />
        <Divider hidden />
      </>
    );
  }
  return (
    <Form>
      <Header as="h3">
        <Translate id="selectionSetSelector.header" data={{ semester }} />
      </Header>

      {sets.map((set) => (
        <SetRadioButton
          key={set.api}
          set={set}
          answeredQuestions={answeredQuestions}
          activeSet={activeSet}
          onChange={onChange}
          groupedQuestions={groupQuestionsBySet(questions)[set.api]}
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
    sets: state.settings.sets,
    loading: state.loading.sets
  };
};

export default connect(mapStateToProps)(SelectionSetSelector);
