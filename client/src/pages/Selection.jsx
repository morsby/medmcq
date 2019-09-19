import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from 'actions';

import _ from 'lodash';

import { breakpoints, urls } from 'utils/common';
import { calculateResults } from 'utils/quiz';

import selectionTranslations from 'Translations/selectionTranslations.json';
import { withLocalize, Translate } from 'react-localize-redux';

import { Container, Header, Divider, Button, Message, Input, Checkbox } from 'semantic-ui-react';

import SelectionSemesterSelector from 'components/SelectionSettings/SelectionSemesterSelector';
import SelectionNSelector from 'components/SelectionSettings/SelectionNSelector';
import SelectionSetSelector from 'components/SelectionSettings/SelectionSetSelector/SelectionSetSelector';
import SelectionSpecialtiesSelector from 'components/SelectionSettings/SelectionMetadataSelector/SelectionMetadataSelector';
import SelectionTypeSelector from 'components/SelectionSettings/SelectionTypeSelector';
import SelectionUniqueSelector from 'components/SelectionSettings/SelectionUniqueSelector';
import SelectionMessage from 'components/SelectionSettings/SelectionMessage';

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 * Props beskrives i bunden.
 */
class SelectionMain extends Component {
  state = { err: [], search: '', loading: false };

  constructor(props) {
    super(props);
    this.props.addTranslation(selectionTranslations);
    this.searchHandler = this.searchHandler.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    if (err.length === 0) {
      // Hvis vi er ved at søge
      if (this.state.search !== '') {
        this.props.searchQuestion(this.props.ui.selection.selectedSemester, this.state.search);
        return this.props.history.push(urls.quiz);
      }

      // tjek for fejl, start eller ej
      // Ny quiz? Hent spørgsmål
      if (quizType === 'new') {
        this.props.startQuiz();
      }

      // Uanset om det er en ny quiz eller ej – skift url til quizzen.
      this.props.history.push(urls.quiz);
    } else {
      this.setState({ err });
    }
  }

  render() {
    /**
     * Alle de nedenstående variable kommer fra selectionReducer -- de har
     * derfor IKKE noget med selve quiz-spørgsmålene at gøre, og hentes for
     * at kunne tælle antal spørgsmål for hvert semester, speciale m.v.
     */

    let { user, metadata } = this.props;
    let semesters = metadata.entities.semesters || {};
    let { type, n, selectedSemester, selectedSetId, onlyNew, noPicture } = this.props.ui.selection;

    return (
      <div className="flex-container">
        <Container className="content">
          <Header as="h1" style={{ textAlign: 'center' }}>
            MedMcq
          </Header>
          <Divider />
          <SelectionSemesterSelector
            label={this.props.translate('selection.static.choose_semester')}
            name="selectedSemester"
            semesters={_.map(metadata.entities.semesters, ({ id, value, name }) => ({
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
                icon="search"
                iconPosition="left"
                placeholder={this.props.translate('search.placeholder')}
                onKeyPress={(e) => this.handleKeyPress(e)}
              />
              <Divider />
            </>
          )}

          {type === 'specialer' && (
            <>
              <SelectionSpecialtiesSelector />
              <Divider hidden />
            </>
          )}

          {type === 'set' && (
            <SelectionSetSelector
              selectedSet={selectedSetId}
              semester={semesters[selectedSemester]}
              onChange={this.onSettingsChange}
            />
          )}

          {selectedSemester === 11 && (
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

          {this.props.questions.result.length > 0 && (
            <Button basic color="orange" onClick={() => this.handleSubmit('cont')}>
              <Translate id="selection.static.continue_quiz" />
            </Button>
          )}

          <SelectionMessage user={user} type={type} />

          <Divider hidden />
        </Container>
      </div>
    );
  }
}

SelectionMain.propTypes = {
  // metadataReducer
  metadata: PropTypes.object,

  // startQuiz action
  startQuiz: PropTypes.func,

  // uiReducer
  ui: PropTypes.object,

  /**
   * Func der kaldes, når der ændres indstillinger. Ændrer Redux state.
   */
  changeSelection: PropTypes.func,

  /// GAMLE PROPS

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
  questions: PropTypes.object,

  /**
   * Tilføjer hhv. står for oversættelser
   * Fra react-localize-redux
   */
  addTranslation: PropTypes.func,
  translate: PropTypes.func,
  searchQuestion: PropTypes.func,

  // Til oprydning
  fetchMetadata: PropTypes.func,
  settings: PropTypes.object,
  specialties: PropTypes.object,
  tags: PropTypes.object,
  settingsNoPicture: PropTypes.func
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    questions: state.questions,
    selection: state.selection,

    // nye props
    metadata: state.metadata,
    ui: state.ui
  };
}

export default withLocalize(
  connect(
    mapStateToProps,
    actions
  )(SelectionMain)
);
