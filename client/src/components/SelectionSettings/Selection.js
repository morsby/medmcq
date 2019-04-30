import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import _ from 'lodash';

import { allowedNs, breakpoints } from '../../utils/common';
import { calculateResults } from '../../utils/quiz';

import selectionTranslations from './selectionTranslations.json';
import { withLocalize, Translate } from 'react-localize-redux';

import { Container, Header, Divider, Button, Message, Input } from 'semantic-ui-react';

import SelectionSemesterSelector from './SelectionSettings/SelectionSemesterSelector';
import SelectionNSelector from './SelectionSettings/SelectionNSelector';
import SelectionSetSelector from './SelectionSettings/SelectionSetSelector/SelectionSetSelector';
import SelectionSpecialtiesSelector from './SelectionSettings/SelectionSpecialtiesSelector/SelectionSpecialtiesSelector';
import SelectionTypeSelector from './SelectionSettings/SelectionTypeSelector';
import SelectionUniqueSelector from './SelectionSettings/SelectionUniqueSelector';
import SelectionMessage from './SelectionMessage';

import { urls } from '../../utils/common';

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 * Props beskrives i bunden.
 */
class SelectionMain extends Component {
  state = { err: [], search: '' };

  constructor(props) {
    super(props);
    this.props.addTranslation(selectionTranslations);
    this.searchHandler = this.searchHandler.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Henter nye data, hvis det er længe siden sidst.
   */
  componentDidMount() {
    this.props.fetchSemesters();
  }

  /**
   * Func der ændrer settings i redux state. Passes via Semantic UI (derfor navnene)
   * @param  {event} e         Event. Bruges ikke.
   * @param  {string} name     Den indstilling der ændres
   * @param  {string} value    Den værdi der sættes
   */
  onSettingsChange(e, { value, name, checked }) {
    let type = name;
    this.setState({ err: [] });
    if (type === 'n' && value) value = Number(value);
    if (type === 'onlyNew') value = checked;
    this.props.changeSelection(type, value);
  }

  /**
   * Func der (efter validering) henter spørgsmålene
   * @param  {string} quizType Er der tale om en ny quiz eller fortsættelse
   *                           af en gammel?
   */

  searchHandler(e, { value }) {
    this.setState({ search: value });
  }

  handleSubmit(quizType) {
    let err = [];

    /**
     * Alle de nedenstående variable kommer fra settingsReducer -- de har
     * derfor IKKE noget med selve quiz-spørgsmålene at gøre, og hentes for
     * at kunne tælle antal spørgsmål for hvert semester, speciale m.v.
     */
    let { n, semester, type, set, questions, specialer, tags } = this.props.settings;

    // Når den er tom modtager den fuldt antal

    // VALIDATION
    // Question.length = Antallet af spørgsmål for et semester eller speciale
    // Semester
    if (!semester) {
      err.push(this.props.translate('selection.errs.no_semester'));
    }

    //Specialer
    if (type === 'specialer' && specialer.length === 0 && tags.length === 0) {
      err.push(this.props.translate('selection.errs.no_specialty'));
    }

    // Sæt
    if (type === 'set' && !set) {
      err.push(this.props.translate('selection.errs.no_set'));
    }

    // Findes der spørgsmål?
    if (questions.length === 0) {
      err.push(this.props.translate('selection.errs.no_questions'));
    }

    // Antal
    if (!n) {
      err.push(this.props.translate('selection.errs.no_n'));
    }

    if (n > allowedNs.max) {
      err.push(this.props.translate('selection.errs.n_too_high'));
    }

    if (n < allowedNs.min) {
      err.push(this.props.translate('selection.errs.n_neg'));
    }

    // Hvis vi er ved at søge
    if (this.state.search !== '') {
      this.props.searchQuestion(this.props.settings.semester, this.state.search);
      return this.props.history.push(urls.quiz);
    }

    // tjek for fejl, start eller ej
    if (err.length === 0) {
      // Ny quiz? Hent spørgsmål
      if (quizType === 'new') {
        this.props.getQuestions(this.props.settings);
      }

      // Uanset om det er en ny quiz eller ej – skift url til quizzen.
      this.props.history.push(urls.quiz);
    } else {
      this.setState({ err });
    }
  }

  render() {
    /**
     * Alle de nedenstående variable kommer fra settingsReducer -- de har
     * derfor IKKE noget med selve quiz-spørgsmålene at gøre, og hentes for
     * at kunne tælle antal spørgsmål for hvert semester, speciale m.v.
     */

    let { user } = this.props;
    let { items: semesters, selectedSemester } = this.props.selection.semesters;
    let {
      type,
      n,
      selectedSpecialtyIds,
      selectedTagIds,
      onlyNew
    } = this.props.selection.quizSelection;

    let questions = [],
      sets = [],
      set,
      answeredQuestions = [],
      antalValgte;
    return (
      <div className="flex-container">
        <Container className="content">
          <Header as="h1" style={{ textAlign: 'center' }}>
            medMcq
          </Header>
          <Divider />
          <SelectionSemesterSelector
            label={this.props.translate('selection.static.choose_semester')}
            name="selectedSemester"
            semesters={_.map(semesters, ({ id, value, name }) => ({
              value: id,
              text: `${value}. semester (${name})`
            }))}
            selectedSemester={selectedSemester}
            handleChange={this.onSettingsChange}
          />
          <Divider hidden />

          <SelectionTypeSelector handleClick={this.onSettingsChange} type={type} />

          <Divider hidden />

          {type !== 'set' && (
            <>
              <SelectionNSelector n={Number(n)} onChange={this.onSettingsChange} />
              <Divider hidden />
              <Translate
                id="selectionNSelector.total_n"
                data={{ n: (semesters[selectedSemester] || {}).questionCount }}
              />
              <Divider />
            </>
          )}

          {type !== 'specialer' && type !== 'set' && (
            <>
              <h3>
                <Translate id="search.title" />
              </h3>
              <Input
                value={this.state.search}
                onChange={this.searchHandler}
                fluid
                placeholder={this.props.translate('search.placeholder')}
              />
              <Divider />
            </>
          )}

          {type === 'set' && (
            <SelectionSetSelector
              questions={questions}
              sets={sets}
              activeSet={set}
              semester={semesters[selectedSemester]}
              answeredQuestions={answeredQuestions}
              onChange={this.onSettingsChange}
            />
          )}

          {type === 'specialer' && (
            <>
              <SelectionSpecialtiesSelector
                semester={semesters[selectedSemester]}
                valgteSpecialer={selectedSpecialtyIds}
                valgteTags={selectedTagIds}
                onChange={this.onSettingsChange}
              />
              <Divider hidden />
            </>
          )}

          {this.state.err.length > 0 && (
            <Message negative>
              {this.state.err.map((err) => {
                return <p key={err}>{err}</p>;
              })}
            </Message>
          )}
          <Button
            color="green"
            basic
            onClick={() => this.handleSubmit('new')}
            disabled={
              (antalValgte < 1 && type === 'specialer') || n < allowedNs.min || n > allowedNs.max
            }
          >
            Start!
          </Button>
          {window.innerWidth < breakpoints.mobile && <Divider hidden />}
          {user && type !== 'set' && (
            <SelectionUniqueSelector onlyNew={onlyNew} onChange={this.onSettingsChange} />
          )}

          <SelectionMessage user={user} type={type} />

          {calculateResults(this.props.questions).status === 'in_progress' && (
            <Button onClick={() => this.handleSubmit('cont')}>
              <Translate id="selection.static.continue_quiz" />
            </Button>
          )}

          <Message warning>
            <Translate id="selection.static.front-disclaimer" />
          </Message>
          <Divider hidden />
        </Container>
      </div>
    );
  }
}

SelectionMain.propTypes = {
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
    questions: state.questions,
    selection: state.selection
  };
}

export default withLocalize(
  connect(
    mapStateToProps,
    actions
  )(SelectionMain)
);
