import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withLocalize, Translate } from 'react-localize-redux';
import quizTranslations from '../Translations/quizTranslations.json';

import { Container, Button } from 'semantic-ui-react';

import { Swipeable } from 'react-swipeable';
import QuizLoader from '../components/Quiz/QuizLoader';
import Question from '../containers/Question';
import QuizNavigator from '../components/Quiz/QuizNavigator';
import QuizSummary from '../components/Quiz/QuizSummary';

import { urls } from '../utils/common';
import { withRouter } from 'react-router';
import { smoothScroll } from '../utils/quiz';

const flickNumber = 0.1;

/**
 *  Hovedcomponent til Quizzen.
 *  Den håndterer navigationen mellem spørgsmål, og kalder de components
 *  der viser progression, spørgsmål m.v.
 *
 *  Props: deklareres og forklares i bunden.
 */

class QuizMain extends Component {
  /**
   * state:
   * - qn : Indeholder navigationen (spørgsmålsindeks)
   */
  state = { imgOpen: false };

  constructor(props) {
    super(props);

    this.props.addTranslation(quizTranslations);

    this.navigateToPage = this.navigateToPage.bind(this);

    this.swiped = this.swiped.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onImgClick = this.onImgClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown);

    let { quiz, questions } = this.props;

    /*
    Hvis quizzen er invalid (dvs. vi har hentet spørgsmål via fx profilsiden)
    og vi ikke er ved at hente nye spørgsmål, henter vi spørgsmål igen:
    */
    if (quiz.didInvalidate && !questions.isFetching) {
      this.props.getQuestions({ ids: quiz.questions });
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  /**
   * Den egentlige navigationsfunktion
   * @param  {number} q det indeks der ønskes navigeret til
   */
  onChangeQuestion = (q) => {
    this.props.changeQuestion(q);

    smoothScroll();
  };

  /**
   * Navigerer til en side.
   * @param  {string} path alle URLS bør defineres og kaldes fra 'src/utils/common.js'
   */
  navigateToPage(path) {
    this.props.history.push(urls[path]);
  }

  /**
   * Navigation mellem spørgsmål
   */
  onKeydown(e) {
    if (!this.state.imgOpen) {
      /**
       * Navigation ved piletaster
       * Tjekker om det aktive element er et TEXTAREA (kommentarfeltet) og
       * navigerer i så fald IKKE
       */
      let qn = this.props.quiz.currentQuestion,
        max = this.props.quiz.questions.length;
      if (document.activeElement.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        if (qn > 0) {
          smoothScroll();
          this.props.changeQuestion(qn - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (qn < max - 1) {
          smoothScroll();
          this.props.changeQuestion(qn + 1);
        }
      }
    }
  }

  swiped(e, deltaX) {
    if (!this.state.imgOpen) {
      let { questions, qn } = this.props.quiz;
      // Navigation ved swipes
      let min = 0;
      let max = Object.keys(questions).length;

      let move;

      if (deltaX > 75) {
        move = 1;
      }

      if (deltaX < -75) {
        move = -1;
      }
      if (move >= min && move < max) {
        smoothScroll();
        this.props.changeQuestion(qn + move);
      }
      if (move >= min && move < max) this.onChangeQuestion(move);
    }
  }

  /** Håndtering af pop-up af billeder **/
  onImgClick() {
    this.setState((prevState) => {
      return { imgOpen: !prevState.imgOpen };
    });
  }

  render() {
    let { questions, user, quiz } = this.props;
    let { answers, didInvalidate } = quiz;
    /* 
    Hvis vi er ved at hente spørgsmål eller quizzen er invalid (-- i så fald henter vi nye spørgsmål
    i componentDidMount) 
    */
    if (questions.isFetching || didInvalidate) {
      return (
        <Translate>
          {({ translate }) => (
            <QuizLoader
              handleRetry={() => this.navigateToPage('root')}
              handleAbort={() => this.navigateToPage('root')}
              text={{
                retry: translate('quizLoader.retry'),
                fetching: translate('quizLoader.fetching'),
                abort: translate('quizLoader.abort'),
                long_wait: translate('quizLoader.long_wait')
              }}
            />
          )}
        </Translate>
      );
    }

    if (Object.keys(questions.entities).length === 0) {
      return (
        <div className="flex-container">
          <div className="content">
            <Container>
              <h1>
                <Translate id="quizLoader.noresultsHeader" />
              </h1>
              <Button onClick={() => this.navigateToPage('root')} basic color="blue">
                <Translate id="quizLoader.noresults" />
              </Button>
            </Container>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-container">
        <div className="content">
          <QuizNavigator
            onNavigate={this.onChangeQuestion}
            qn={quiz.currentQuestion}
            qmax={quiz.questions.length}
            position="top"
          />

          <Swipeable
            onSwipedLeft={this.swiped}
            onSwipedRight={this.swiped}
            flickThreshold={flickNumber}
          >
            <Question onImgClick={this.onImgClick} imgOpen={this.state.imgOpen} user={user} />
          </Swipeable>

          <QuizNavigator
            onNavigate={this.onChangeQuestion}
            qn={quiz.currentQuestion}
            qmax={quiz.questions.length}
          />

          <QuizSummary
            questions={questions}
            answers={answers}
            clickHandler={this.onChangeQuestion}
          />
        </div>
      </div>
    );
  }
}

QuizMain.propTypes = {
  /**
   * fra redux
   *
   */
  quiz: PropTypes.object,

  changeQuestion: PropTypes.func,

  answers: PropTypes.object,

  /**
   * Fra Redux
   * Et objekt indeholdende brugeren (id, brugernavn, email, gemte svar mv.)
   * Se authReducer.js
   */
  user: PropTypes.object,

  /**
   * Fra ReactRouter.
   * Indeholder nuværende path m.v. - og mulighed for navigation.
   */
  history: PropTypes.object,

  /**
   * Tilføjer quizTranslations i hele app'en
   */
  addTranslation: PropTypes.func,

  qn: PropTypes.number,
  questions: PropTypes.object,
  getQuestions: PropTypes.func
};

function mapStateToProps(state) {
  return {
    quiz: state.quiz,
    user: state.auth.user,
    questions: state.questions
  };
}

export default withRouter(
  withLocalize(
    connect(
      mapStateToProps,
      actions
    )(QuizMain)
  )
);
