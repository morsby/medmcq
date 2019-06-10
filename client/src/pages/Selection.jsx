import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { allowedNs, breakpoints } from '../utils/common';
import { calculateResults } from '../utils/quiz';

import selectionTranslations from '../Translations/selectionTranslations.json';
import { withLocalize, Translate } from 'react-localize-redux';

import {
  Container,
  Header,
  Dropdown,
  Divider,
  Button,
  Message,
  Input,
  Checkbox
} from 'semantic-ui-react';

import SelectionNSelector from '../components/Selection/SelectionSettings/SelectionNSelector';
import SelectionSetSelector from '../components/Selection/SelectionSettings/SelectionSetSelector/SelectionSetSelector';
import SelectionSpecialtiesSelector from '../components/Selection/SelectionSettings/SelectionSpecialtiesSelector/SelectionSpecialtiesSelector';
import SelectionTypeSelector from '../components/Selection/SelectionSettings/SelectionTypeSelector';
import SelectionUniqueSelector from '../components/Selection/SelectionSettings/SelectionUniqueSelector';
import SelectionMessage from '../components/Selection/SelectionMessage';

import { semestre, urls } from '../utils/common';

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 * Props beskrives i bunden.
 */
class SelectionMain extends Component {
  state = { err: [], search: '', loading: false };

  constructor(props) {
    super(props);
    if (
      this.props.specialties.length === 0 ||
      this.props.tags.length === 0 ||
      Date.now() - this.props.lastMetadataFetch > 3.6 * Math.pow(10, 6)
    )
      this.state.loading = true;
    this.props.getTotalQuestionCount(this.props.settings.semester);
    this.props.addTranslation(selectionTranslations);
    this.searchHandler = this.searchHandler.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Seeder data hvis det er første besøg.
   * Tager nu højde for evt. "tomme" semestre, da semester = 7 er default
   */
  async componentDidMount() {
    let { totalQuestions, semester, type } = this.props.settings;
    if (totalQuestions === 0 && semester === 7) {
      type = 'semester';
      const value = 7;
      const e = null;

      this.onSettingsChange(e, { type, value });
    }

    if (
      this.props.specialties.length === 0 ||
      this.props.tags.length === 0 ||
      Date.now() - this.props.lastMetadataFetch > 3.6 * Math.pow(10, 6)
    ) {
      this.props.getSets(this.props.settings.semester, this.props.user);
      await this.getMetadata();
      this.setState({ loading: false });
    }
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.settings.semester !== prevProps.settings.semester ||
      this.props.user !== prevProps.user
    ) {
      if (this.props.settings.semester !== prevProps.settings.semester) {
        this.setState({ loading: true });
      }
      await this.props.getSets(this.props.settings.semester, this.props.user);
      await this.getMetadata();
      this.setState({ loading: false });
    }
  }

  getMetadata = async () => {
    await this.props.fetchMetadata(this.props.settings.semester);
  };

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

  onNoPicture = () => {
    this.props.settingsNoPicture(!this.props.settings.noPicture);
  };

  /**
   * Func der (efter validering) henter spørgsmålene
   * @param  {string} quizType Er der tale om en ny quiz eller fortsættelse
   *                           af en gammel?
   */

  searchHandler(e, { value }) {
    this.setState({ search: value });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit('new');
    }
  };

  handleSubmit(quizType) {
    let err = [];

    /**
     * Alle de nedenstående variable kommer fra settingsReducer -- de har
     * derfor IKKE noget med selve quiz-spørgsmålene at gøre, og hentes for
     * at kunne tælle antal spørgsmål for hvert semester, speciale m.v.
     */
    let { n, semester, type, set, specialer, tags, noPicture } = this.props.settings;

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
    if (this.props.totalQuestions === 0) {
      err.push(this.props.translate('selection.errs.no_questions'));
    }

    // Antal
    if (type !== 'set') {
      if (!n) {
        err.push(this.props.translate('selection.errs.no_n'));
      }

      if (n > allowedNs.max) {
        err.push(this.props.translate('selection.errs.n_too_high'));
      }

      if (n < allowedNs.min) {
        err.push(this.props.translate('selection.errs.n_neg'));
      }
    }

    if (err.length === 0) {
      // Hvis vi er ved at søge
      if (this.state.search !== '') {
        this.props.searchQuestion(this.props.settings.semester, this.state.search);
        return this.props.history.push(urls.quiz);
      }

      // tjek for fejl, start eller ej
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
    let {
      semester,
      specialer,
      tags,
      type,
      n,
      onlyNew,
      totalQuestions,
      set,
      noPicture
    } = this.props.settings;

    let { user } = this.props,
      answeredQuestions;

    // Hvis brugeren har svaret på spørgsmål før, så hent disses id.
    if (this.props.user && this.props.user.hasOwnProperty('answeredQuestions')) {
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
                total={totalQuestions}
                semester={semester}
              />
              <Divider hidden />
              <Translate id="selectionNSelector.total_n" data={{ n: totalQuestions }} />
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
                icon="search"
                iconPosition="left"
                placeholder={this.props.translate('search.placeholder')}
                onKeyPress={(e) => this.handleKeyPress(e)}
              />
              <Divider />
            </>
          )}

          {type === 'set' && (
            <SelectionSetSelector
              activeSet={set}
              semester={semester}
              answeredQuestions={answeredQuestions}
              onChange={this.onSettingsChange}
              loading={this.state.loading}
            />
          )}

          {type === 'specialer' && (
            <>
              <SelectionSpecialtiesSelector
                semester={semester}
                valgteSpecialer={specialer}
                valgteTags={tags}
                onChange={this.onSettingsChange}
                specialties={this.props.specialties}
                tags={this.props.tags}
                loading={this.state.loading}
              />
              <Divider hidden />
            </>
          )}

          {semester === 11 && (
            <div style={{ marginBottom: '1rem' }}>
              <Checkbox
                checked={noPicture}
                onChange={this.onNoPicture}
                label={this.props.translate('selection.static.no_picture')}
              />
            </div>
          )}

          {this.state.err.length > 0 && (
            <Message negative>
              {this.state.err.map((err) => {
                return <p key={err}>{err}</p>;
              })}
            </Message>
          )}
          <Button color="green" basic onClick={() => this.handleSubmit('new')}>
            Start!
          </Button>
          {window.innerWidth < breakpoints.mobile && <Divider hidden />}
          {user && type !== 'set' && (
            <SelectionUniqueSelector onlyNew={onlyNew} onChange={this.onSettingsChange} />
          )}

          {calculateResults(this.props.questions).status && (
            <Button basic color="orange" onClick={() => this.handleSubmit('cont')}>
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
    specialties: state.settings.metadata.specialties,
    tags: state.settings.metadata.tags,
    lastMetadataFetch: state.settings.metadata.date,
    totalQuestions: state.settings.totalQuestionCount
  };
}

export default withLocalize(
  connect(
    mapStateToProps,
    actions
  )(SelectionMain)
);
