import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button } from 'semantic-ui-react';
import LoadingPage from '../misc/Utility-pages/LoadingPage';

/**
 * Loading-screen component ved start af quiz.
 * Kan forsøge igen eller fortryde anmodningen om spørgsmål
 *
 * Virker ved at sætte et interval - afhængig af tiden det tager, vises
 * forskellige beskeder.
 */

class QuizLoader extends Component {
  state = { seconds: 0 };

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState((prevState) => ({
      seconds: prevState.seconds + 1
    }));
  }

  render() {
    let longWait = '',
      { handleRetry, handleAbort, text } = this.props;
    if (this.state.seconds >= 2) {
      longWait = (
        <div style={{ margin: '5px 0' }}>
          <Divider hidden />
          <p>{text.long_wait}</p>
          <Button basic color="blue" onClick={handleRetry}>
            {text.retry}
          </Button>
          <Button basic color="yellow" onClick={handleAbort}>
            {text.abort}
          </Button>
        </div>
      );
    }
    return (
      <div style={{ margin: '1rem 5rem', textAlign: 'center', minHeight: '100vh' }}>
        <LoadingPage />
        {longWait}
      </div>
    );
  }
}

QuizLoader.propTypes = {
  /**
   * Fra Quiz.js
   * Kalder getQuestions (fra redux) - hvis første request faldt ud pga. tabt
   * forbindelse.
   */
  handleRetry: PropTypes.func,

  /**
   * Fra Quiz.js
   * Navigerer tilbage til forsiden.
   */
  handleAbort: PropTypes.func,

  /**
   * Tekst indeholdende den oversatte tekst til hver knap/besked.
   * Fra ./Quiz.js (via react-localize-redux) fordi oversættelsen drillede....
   */
  text: PropTypes.object
};

export default QuizLoader;
