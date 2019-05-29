import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';

import { allowedNs, breakpoints } from '../utils/common';
import { calculateResults } from '../utils/quiz';

import selectionTranslations from '../Translations/selectionTranslations.json';
import { withLocalize, Translate } from 'react-localize-redux';

import { Container, Header, Dropdown, Divider, Button, Message, Input } from 'semantic-ui-react';

import SelectionNSelector from '../components/Selection/SelectionSettings/SelectionNSelector';
import SelectionSetSelector from '../components/Selection/SelectionSettings/SelectionSetSelector/SelectionSetSelector';
import SelectionSpecialtiesSelector from '../components/Selection/SelectionSettings/SelectionSpecialtiesSelector/SelectionSpecialtiesSelector';
import SelectionTypeSelector from '../components/Selection/SelectionSettings/SelectionTypeSelector';
import SelectionUniqueSelector from '../components/Selection/SelectionSettings/SelectionUniqueSelector';
import SelectionMessage from '../components/Selection/SelectionMessage';

import { semestre, urls } from '../utils/common';
import { fetchMetadata, fetchSettingsQuestions, changeSettings } from './../actions/settings';
import { getQuestions, searchQuestion } from './../actions/questions';

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 * Props beskrives i bunden.
 */
const Selection = ({
  semester,
  type,
  totalQuestions,
  lastSettingsQuestionFetch,
  chosenQuestions,
  chosenSpecialties,
  chosenTags,
  set,
  n,
  history,
  user,
  sets,
  addTranslation,
  searchQuestion,
  onlyNew,
  translate,
  changeSettings
}) => {
  const [err, setErr] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  fetchSettingsQuestions(semester);
  addTranslation(selectionTranslations);

  /**
   * Seeder data hvis det er første besøg.
   * Tager nu højde for evt. "tomme" semestre, da semester = 7 er default
   */
  useEffect(() => {
    if (totalQuestions.length === 0 && semester === 7) {
      type = 'semester';
      const value = 7;
      const e = null;

      onSettingsChange(e, { type, value });
    }
  }, []);

  /**
   * Func der ændrer settings i redux state. Passes via Semantic UI (derfor navnene)
   * @param  {event} e         Event. Bruges ikke.
   * @param  {string} name     Den indstilling der ændres
   * @param  {string} value    Den værdi der sættes
   */
  const onSettingsChange = (e, { value, name, checked }) => {
    let type = name;
    setErr([]);
    if (type === 'n' && value) value = Number(value);
    if (type === 'onlyNew') value = checked;
    changeSettings({ type, value, lastSettingsQuestionFetch });
  };

  /**
   * Func der (efter validering) henter spørgsmålene
   * @param  {string} quizType Er der tale om en ny quiz eller fortsættelse
   *                           af en gammel?
   */

  const searchHandler = (e, { value }) => {
    setSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit('new');
    }
  };

  const handleSubmit = (quizType) => {
    let err = [];

    // VALIDATION
    // Question.length = Antallet af spørgsmål for et semester eller speciale
    // Semester
    if (!semester) {
      err.push(translate('selection.errs.no_semester'));
    }

    //Specialer
    if (type === 'specialer' && chosenSpecialties.length === 0 && chosenTags.length === 0) {
      err.push(translate('selection.errs.no_specialty'));
    }

    // Sæt
    if (type === 'set' && !set) {
      err.push(translate('selection.errs.no_set'));
    }

    // Findes der spørgsmål?
    if (chosenQuestions.length === 0) {
      err.push(translate('selection.errs.no_questions'));
    }

    // Antal
    if (!n) {
      err.push(translate('selection.errs.no_n'));
    }

    if (n > allowedNs.max) {
      err.push(translate('selection.errs.n_too_high'));
    }

    if (n < allowedNs.min) {
      err.push(translate('selection.errs.n_neg'));
    }

    // Hvis vi er ved at søge
    if (search !== '') {
      searchQuestion(semester, search);
      return history.push(urls.quiz);
    }

    // tjek for fejl, start eller ej
    if (err.length === 0) {
      // Ny quiz? Hent spørgsmål
      if (quizType === 'new') {
        getQuestions({ type, semester, chosenSpecialties, chosenTags, n, onlyNew, set });
      }

      // Uanset om det er en ny quiz eller ej – skift url til quizzen.
      history.push(urls.quiz);
    } else {
      this.setState({ err });
    }
  };

  let answeredQuestions = [];
  // Hvis brugeren har svaret på spørgsmål før, så hent disses id.
  if (user && user.hasOwnProperty('answeredQuestions')) {
    answeredQuestions = user.answeredQuestions[semester];
  }

  return (
    <div className="flex-container">
      <Container className="content">
        <Header as="h1" style={{ textAlign: 'center' }}>
          MedMcq
        </Header>
        <Divider />
        <Header as="h3">
          <Translate id="selection.static.choose_semester" />
        </Header>
        <Dropdown
          placeholder={translate('selection.static.choose_semester')}
          fluid
          selection
          options={semestre}
          name="semester"
          value={semester}
          onChange={onSettingsChange}
        />
        <Divider hidden />
        <SelectionTypeSelector handleClick={onSettingsChange} type={type} />

        <Divider hidden />

        {type !== 'set' && (
          <>
            <SelectionNSelector
              n={Number(n)}
              onChange={onSettingsChange}
              total={chosenQuestions.length}
              semester={semester}
            />
            <Divider hidden />
            <Translate id="selectionNSelector.total_n" data={{ n: chosenQuestions.length }} />
            <Divider />
          </>
        )}

        {type !== 'specialer' && type !== 'set' && (
          <>
            <h3>
              <Translate id="search.title" />
            </h3>
            <Input
              value={search}
              onChange={searchHandler}
              fluid
              placeholder={translate('search.placeholder')}
              onKeyPress={(e) => handleKeyPress(e)}
            />
            <Divider />
          </>
        )}

        {type === 'set' && (
          <SelectionSetSelector
            questions={chosenQuestions}
            sets={sets}
            activeSet={set}
            semester={semester}
            answeredQuestions={answeredQuestions}
            onChange={onSettingsChange}
          />
        )}

        {type === 'specialer' && (
          <>
            <SelectionSpecialtiesSelector onChange={onSettingsChange} loading={loading} />
            <Divider hidden />
          </>
        )}

        {err.length > 0 && (
          <Message negative>
            {this.state.err.map((err) => {
              return <p key={err}>{err}</p>;
            })}
          </Message>
        )}
        <Button color="green" basic onClick={() => handleSubmit('new')}>
          Start!
        </Button>
        {window.innerWidth < breakpoints.mobile && <Divider hidden />}
        {user && type !== 'set' && (
          <SelectionUniqueSelector onlyNew={onlyNew} onChange={onSettingsChange} />
        )}

        {calculateResults(totalQuestions).status && (
          <Button basic color="orange" onClick={() => handleSubmit('cont')}>
            <Translate id="selection.static.continue_quiz" />
          </Button>
        )}

        <SelectionMessage user={user} type={type} />

        <Message warning>
          <Translate id="selection.static.front-disclaimer" />
        </Message>
        <Divider hidden />
      </Container>
    </div>
  );
};

Selection.propTypes = {
  /**
   * Indstillinger der styrer valg af spørgsmål.
   * Bruges til at hente nye spørgsmål.
   * Fra redux.
   */
  settings: PropTypes.object,

  /**
   * Func der kaldes, når der ændres indstillinger. Ændrer Redux state.
   */
  changeSettings: PropTypes.func,

  /**
   * Func der henter nye spørgsmål til semesteret. Ændrer redux state
   */
  fetchSettingsQuestions: PropTypes.func,

  /**
   * Func der henter nye spørgsmål (ud fra settings) fra API'en.
   */
  getQuestions: PropTypes.func,

  /**
   * Fra ReactRouter.
   */
  history: ReactRouterPropTypes.history,

  /**
   * Brugeren. Bruges bl.a. til at holde styr på tidligere besvarelser.
   */
  user: PropTypes.object,

  /**
   * Evt. allerede hentede spørgsmål. Benyttes til at give muligheden for at
   * fortsætte en tidligere quiz.
   */
  questions: PropTypes.array,

  /**
   * Tilføjer hhv. står for oversættelser
   * Fra react-localize-redux
   */
  addTranslation: PropTypes.func,
  translate: PropTypes.func,
  searchQuestion: PropTypes.func
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
    user: state.auth.user,
    totalQuestions: state.questions,
    lastMetadataFetch: state.settings.metadata.date,
    semester: state.settings.semester,
    chosenQuestions: state.settings.questions,
    type: state.settings.type,
    lastSettingsQuestionFetch: state.settings.lastSettingsQuestionFetch,
    chosenSpecialties: state.settings.specialer,
    chosenTags: state.settings.tags,
    n: state.settings.n,
    set: state.settings.set,
    sets: state.settings.sets,
    onlyNew: state.settings.onlyNew
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMetadata: (semester) => dispatch(fetchMetadata(semester)),
    fetchSettingsQuestions: (semester) => dispatch(fetchSettingsQuestions(semester)),
    changeSettings: (settings) => dispatch(changeSettings(settings)),
    getQuestions: (settings) => dispatch(getQuestions(settings)),
    searchQuestion: (semester, search) => dispatch(searchQuestion(semester, search))
  };
};

export default withLocalize(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Selection)
);
