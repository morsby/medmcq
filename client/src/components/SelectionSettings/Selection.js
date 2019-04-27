import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { allowedNs, breakpoints } from '../../utils/common';
import { calculateResults } from '../../utils/quiz';

import selectionTranslations from './selectionTranslations.json';
import { withLocalize, Translate } from 'react-localize-redux';

import _ from 'lodash';

import { Container, Header, Dropdown, Divider, Button, Message, Input } from 'semantic-ui-react';

import SelectionNSelector from './SelectionSettings/SelectionNSelector';
import SelectionSetSelector from './SelectionSettings/SelectionSetSelector/SelectionSetSelector';
import SelectionSpecialtiesSelector from './SelectionSettings/SelectionSpecialtiesSelector/SelectionSpecialtiesSelector';
import SelectionTypeSelector from './SelectionSettings/SelectionTypeSelector';
import SelectionUniqueSelector from './SelectionSettings/SelectionUniqueSelector';
import SelectionMessage from './SelectionMessage';

import { semestre, urls } from '../../utils/common';
import { specialer as specialerCommon, tags as tagsCommon } from '../../utils/common';

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 * Props beskrives i bunden.
 */
class SelectionMain extends Component {
  state = { err: [], search: '' };

  constructor(props) {
    super(props);
    this.props.fetchSettingsQuestions(this.props.settings.semester);
    this.props.addTranslation(selectionTranslations);
    this.searchHandler = this.searchHandler.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Seeder data hvis det er første besøg.
   * Tager nu højde for evt. "tomme" semestre, da semester = 7 er default
   */
  componentDidMount() {
    let { questions, semester, type } = this.props.settings;
    if (questions.length === 0 && semester === 7) {
      type = 'semester';
      const value = 7;
      const e = null;

      this.onSettingsChange(e, { type, value });
    }
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
    let { lastSettingsQuestionFetch } = this.props.settings;
    this.props.changeSettings({ type, value, lastSettingsQuestionFetch });
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
    let { semester, specialer, tags, type, n, onlyNew, questions, sets, set } = this.props.settings;

    let { user } = this.props,
      answeredQuestions;

    // Hvis brugeren har svaret på spørgsmål før, så hent disses id.
    if (this.props.user && this.props.user.hasOwnProperty('answeredQuestions')) {
      answeredQuestions = user.answeredQuestions[semester];
    }

    // Laver et array af specialer for semesteret
    let uniques = {
      specialer: specialerCommon[semester].map((s) => s.value),
      tags: tagsCommon[semester].map((t) => t.value)
    };

    // Grupperer de fundne spørgsmål efter specialer
    let questionsBySpecialty = _.countBy(
      // Laver et flat array af alle i spg indeholdte specialer
      _.flattenDeep(questions.map((a) => a.specialty)),
      (e) => {
        return uniques.specialer[uniques.specialer.indexOf(e)];
      }
    );

    // Grupperer de fundne spørgsmål efter tags
    let questionsByTag = _.countBy(
      // Laver et flat array af alle i spg indeholdte tags
      _.flattenDeep(questions.map((a) => a.tags)),
      (e) => {
        return uniques.tags[uniques.tags.indexOf(e)];
      }
    );

    // Tjekker hvor mange der er valgt
    let antalValgte = 0;
    specialer.map((s) => {
      let n = questionsBySpecialty[s] ? questionsBySpecialty[s] : 0;
      antalValgte = antalValgte + n;
      return null;
    });

    tags.map((t) => {
      let n = questionsByTag[t] ? questionsByTag[t] : 0;
      antalValgte = antalValgte + n;
      return null;
    });

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
            placeholder={this.props.translate('selection.static.choose_semester')}
            fluid
            selection
            options={semestre}
            name="semester"
            value={semester}
            onChange={this.onSettingsChange}
          />
          <Divider hidden />
          <SelectionTypeSelector handleClick={this.onSettingsChange} type={type} />

          <Divider hidden />

          {type !== 'set' && (
            <>
              <SelectionNSelector
                n={Number(n)}
                onChange={this.onSettingsChange}
                semester={semester}
              />
              <Divider hidden />
              <Translate id="selectionNSelector.total_n" data={{ n: questions.length }} />
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
              semester={semester}
              answeredQuestions={answeredQuestions}
              onChange={this.onSettingsChange}
            />
          )}

          {type === 'specialer' && (
            <>
              <SelectionSpecialtiesSelector
                semester={semester}
                valgteSpecialer={specialer}
                antalPerSpeciale={questionsBySpecialty}
                valgteTags={tags}
                antalPerTag={questionsByTag}
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
    questions: state.questions
  };
}

export default withLocalize(
  connect(
    mapStateToProps,
    actions
  )(SelectionMain)
);
