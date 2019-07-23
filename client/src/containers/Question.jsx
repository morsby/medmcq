import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';
import marked from 'marked';

import _ from 'lodash';
import { imageURL, breakpoints } from '../utils/common';

import { subSupScript, isAnswered } from '../utils/quiz';

import { Container, Grid, Divider, Segment, Responsive } from 'semantic-ui-react';

import QuestionAnswerButtons from '../components/Quiz/Question/QuestionAnswerButtons';
import QuestionImage from '../components/Quiz/Question/QuestionImage';
import QuestionMetadata from '../components/Quiz/Question/QuestionMetadata';
import QuestionExtras from '../components/Quiz/Question/QuestionExtras';

/**
 * Component ansvarlig for at vise selve spørgsmålet, evt. billeder, kommentarer
 * og svar.
 */

class Question extends PureComponent {
  state = {
    /**
     * Current window width
     */
    width: window.innerWidth
  };

  constructor(props) {
    super(props);
    this.handleResize = _.debounce(this.handleResize, 300);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * For at kunne svare med tal på keyboardet
   * Tager højde for modifier keys (alt, ctrl, meta)
   */
  onKeydown = (e) => {
    if (
      !this.props.imgOpen &&
      !(
        document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT'
      ) &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      let answer = Number(e.key);

      let keys = [1, 2, 3];
      if (keys.includes(answer)) {
        this.onAnswer(answer);
      }
    }
  };

  handleResize = () => this.setState({ width: window.innerWidth });

  /**
   * Ansvarlig for at fortælle redux at der er svaret
   * @param  {number} answer Det der er svaret (1, 2 el. 3)
   */
  onAnswer = (answer) => {
    let { answerQuestion, question } = this.props;

    // If not already answered:
    if (!isAnswered(question)) {
      // Er svaret korrekt? Tager højde for flere korrekte svarmuligheder
      let correct;
      if (Array.isArray(question.correctAnswer)) {
        correct = !!question.correctAnswer.includes(answer);
      } else {
        correct = question.correctAnswer === answer;
      }

      // Call answerQuestion fra redux
      answerQuestion(question.id, answer, correct);
    }
  };

  render() {
    let { question, user, answers } = this.props;
    const text = subSupScript(question.text);

    return (
      <Container className="question">
        <Segment>
          <Grid divided columns="equal" stackable>
            <Grid.Row>
              <Grid.Column>
                <div
                  style={{ fontSize: '18px' }}
                  dangerouslySetInnerHTML={{
                    __html: marked(text, {
                      smartypants: true
                    })
                  }}
                  ref={(ref) => (this._div = ref)}
                />
                <Responsive as="div" minWidth={breakpoints.mobile + 1}>
                  <Divider />

                  <QuestionAnswerButtons
                    question={question}
                    answer={answers[question.id]}
                    onAnswer={this.onAnswer}
                  />
                </Responsive>
              </Grid.Column>
              {question.image && (
                <Grid.Column>
                  <QuestionImage
                    img={imageURL(question.image)}
                    onClick={this.props.onImgClick}
                    imgOpen={this.props.imgOpen}
                  />
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
          <Responsive as="div" maxWidth={breakpoints.mobile}>
            <Divider />
            <QuestionAnswerButtons
              question={question}
              answer={answers[question.id]}
              onAnswer={this.onAnswer}
            />
          </Responsive>
          <QuestionMetadata question={question} user={user} />
          <QuestionExtras
            deleteComment={this.props.deleteComment}
            commentQuestion={this.props.commentQuestion}
            editComment={this.props.editComment}
            questionReport={this.props.questionReport}
            width={this.state.width}
            question={question}
            user={user}
          />
        </Segment>
        <Divider hidden />
      </Container>
    );
  }
}

Question.propTypes = {
  /**
   * Det aktuelle spørgsmål. Fra redux
   * @type {array}
   */
  question: PropTypes.object,

  /**
   * Object af svar. question.id er keys
   */
  answers: PropTypes.object,

  /**
   * Brugeren (hvis nogen). Fra Quiz.js
   * @type {object}
   */
  user: PropTypes.object,

  /**
   * Action der kaldes ved svar. Fra redux.
   * @type {func}
   */
  answerQuestion: PropTypes.func,

  /**
   * Action der kaldes ved indrapportering af en fejl i spørgsmålet
   * @type {func}
   */
  questionReport: PropTypes.func,

  /**
   * Action der kaldes ved ændring af kommentar. Fra redux.
   * @type {func}
   */
  editComment: PropTypes.func,

  /**
   * Action der kaldes ved kommentar. Fra redux.
   * @type {func}
   */
  commentQuestion: PropTypes.func,

  /**
   * Action der kaldes ved sletning af kommentar. Fra redux.
   * @type {func}
   */
  deleteComment: PropTypes.func,

  /**
   * Action der kaldes når der ændres specialer. Fra redux.
   * @type {func}
   */
  editSpecialties: PropTypes.func,

  imgOpen: PropTypes.bool,
  onImgClick: PropTypes.func
};

const mapStateToProps = (state) => ({
  question: state.questions.entities.questions[state.quiz.questions[state.quiz.currentQuestion]],
  answers: state.quiz.answers
});

export default connect(
  mapStateToProps,
  actions
)(Question);
