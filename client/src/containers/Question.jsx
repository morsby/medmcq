import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';
import marked from 'marked';

import _ from 'lodash';
import { imageURL, breakpoints } from '../utils/common';

import { subSupScript } from '../utils/quiz';

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
     * Er report-formen åben?
     */
    reportOpen: false,

    /**
     * Selve rapporten
     */
    report: '',

    /**
     * Er der sendt en rapport?
     * @type {Boolean}
     */
    reportSent: false,

    /**
     * Er der blevet flyttet på mus el.lign.?
     * Benyttes til styling af svar-buttons.
     * @type {Boolean}
     */
    pristine: true,

    /**
     * Er vi i gang med at ændre på specialer?
     * @type {Boolean}
     */
    editingSpecialties: false,

    /**
     * Selected specialties
     * Defaults til allerede kendte værdier
     * @type {Array}
     */
    selectedSpecialties: this.props.question.specialty,

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
    this.mouseMover();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * For at forhindre lightbox i at være åben på tværs af navigationer og ændring
   * af specialer nulstilles
   */
  componentDidUpdate(prevProps) {
    if (this.props.question._id !== prevProps.question._id) {
      this.setState({
        pristine: true,
        selectedSpecialties: this.props.question.specialty,
        editingSpecialties: false
      });
      this.mouseMover();
    }
  }
  /**
   * For at se om musen er bevæget -- hvis den er, er siden ikke "pristine".
   * Dette bruges i styling af svar-buttons
   */
  mouseMover = () => {
    document.addEventListener(
      'mousemove',
      () => {
        this.setState({ pristine: false });
      },
      { once: true }
    );
  };

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
    let { answerQuestion, question, user, qn } = this.props;

    // If not already answered:
    if (!question.answer) {
      // Er svaret korrekt? Tager højde for flere korrekte svarmuligheder
      let correct;
      if (Array.isArray(question.correctAnswer)) {
        correct = !!question.correctAnswer.includes(answer);
      } else {
        correct = question.correctAnswer === answer;
      }

      // Call answerQuestion fra redux
      answerQuestion(
        question._id,
        answer,
        {
          qn: qn,
          correct: correct
        },
        question.semester,
        user
      );
    }
  };

  render() {
    const { question, user } = this.props;

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
                    onAnswer={this.onAnswer}
                    pristine={this.state.pristine}
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
              onAnswer={this.onAnswer}
              pristine={this.state.pristine}
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
            qn={this.props.qn}
          />
        </Segment>
        <Divider hidden />
      </Container>
    );
  }
}

Question.propTypes = {
  /**
   * Det aktuelle spørgsmål. Fra Quiz.js
   * @type {array}
   */
  question: PropTypes.object,

  /**
   * Nuværende spørgsmålsindeks. Benyttes til at besvare spørgsmål. Fra Quiz.js
   * @type {number}
   */
  qn: PropTypes.number,

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

export default connect(
  null,
  actions
)(Question);
