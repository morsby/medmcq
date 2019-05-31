import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';

import { urls } from '../../../../utils/common';

import { Container, Button } from 'semantic-ui-react';

import PrintDisplayQuestion from './PrintDisplayQuestion';

import printTranslations from './printTranslations.json';

/**
 * Component der viser printervenlig side med de aktuelle spørgsmål og håndterer
 * hvorvidt svar er synlige eller ej.
 */
class Print extends Component {
  state = { showCorrect: false };

  constructor(props) {
    super(props);

    this.props.addTranslation(printTranslations);

    this.toggleAnswers = this.toggleAnswers.bind(this);
  }

  toggleAnswers() {
    this.setState(prevState => {
      return { showCorrect: !prevState.showCorrect };
    });
  }

  handleNavigation(path) {
    this.props.history.push(urls[path]);
  }

  render() {
    let { showCorrect } = this.state;
    let { questions } = this.props;

    return (
      <div className="flex-container">
        <Container className="content print">
          <div className="hide-on-print">
            <Button.Group className="hide-on-print">
              <Button className="primary" onClick={this.toggleAnswers}>
                {showCorrect ? (
                  <Translate id="print.hide_correct" />
                ) : (
                  <Translate id="print.show_correct" />
                )}
              </Button>
              <Button className="hide-on-print" onClick={() => window.print()}>
                <Translate id="print.print" />
              </Button>
            </Button.Group>
            <Button
              color="yellow"
              floated="right"
              onClick={() => this.handleNavigation('quiz')}
            >
              <Translate id="print.return_to_quiz" />
            </Button>
          </div>

          {questions.map((q, i) => {
            return (
              <div className="avoid-page-break" key={q.id}>
                <h3>
                  <Translate id="print.question" data={{ n: i + 1 }} />
                </h3>
                <PrintDisplayQuestion
                  questionProp={q}
                  showCorrect={showCorrect}
                />
              </div>
            );
          })}
        </Container>
      </div>
    );
  }
}

Print.propTypes = {
  /**
   * Array af spørgsmål. Fra redux (questionsReducer)
   */
  questions: PropTypes.array,

  /**
   * Fra ReactRouter
   */
  history: ReactRouterPropTypes.history,

  /**
   * Tilføjer oversættelsr. Fra react-localize-redux
   */
  addTranslation: PropTypes.func
};

function mapStateToProps(state) {
  return {
    questions: state.questions
  };
}

export default connect(
  mapStateToProps,
  null
)(withLocalize(Print));
