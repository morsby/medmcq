import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import marked from 'marked';

import { imageURL, breakpoints } from '../../../utils/common';
import { subSupScript } from '../../../utils/quiz';

import { Container, Grid, Divider, Segment, Button, Responsive } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

import QuestionAnswerButtons from './QuestionAnswerButtons';
import QuestionImage from './QuestionImage';
import QuestionMetadata from './QuestionMetadata';
import QuestionReport from './QuestionReport';
import QuestionComments from './QuestionComments/QuestionComments';

/**
 * Component ansvarlig for at vise selve spørgsmålet, evt. billeder, kommentarer
 * og svar.
 */

class Question extends Component {
  state = {
    /**
     * Er lightbox åben?
     * @type {Boolean}
     */
    imgOpen: false,

    /**
     * Er report-formen åben?
     */
    reportOpen: false,

    /**
     * Selve rapporten
     */
    report: '',

    /**
     * Er kommentarer vist?
     * @type {Boolean}
     */
    commentsOpen: false,

    /**
     * Evt. kommentartekst
     * @type {String}
     */
    newComment: '',

    /**
     * ID på den kommentar der rettes.
     * @type {String}
     */
    editingComment: '',

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
     * @type {Array]
     */
    selectedSpecialties: this.props.question.specialty
  };

  constructor(props) {
    super(props);

    this.onKeydown = this.onKeydown.bind(this);
    this.onImgClick = this.onImgClick.bind(this);
    this.onTextType = this.onTextType.bind(this);
    this.onReportToggle = this.onReportToggle.bind(this);
    this.onReportSubmit = this.onReportSubmit.bind(this);
    this.onCommentsToggle = this.onCommentsToggle.bind(this);
    this.onCommentPost = this.onCommentPost.bind(this);
    this.onDeleteComment = this.onDeleteComment.bind(this);
    this.onEditComment = this.onEditComment.bind(this);
    this.undoEditComment = this.undoEditComment.bind(this);
    this.onAnswer = this.onAnswer.bind(this);

    this.onSpecialtiesEditToggle = this.onSpecialtiesEditToggle.bind(this);
    this.onEditSpecialty = this.onEditSpecialty.bind(this);
    this.onSaveSpecialties = this.onSaveSpecialties.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown);
    this.mouseMover();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  /**
   * For at forhindre lightbox i at være åben på tværs af navigationer og ændring
   * af specialer nulstilles
   */
  componentDidUpdate(prevProps) {
    if (this.props.question._id !== prevProps.question._id) {
      this.setState({
        imgOpen: false,
        commentsOpen: false,
        newComment: '',
        editingComment: '',
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
  mouseMover() {
    document.addEventListener(
      'mousemove',
      () => {
        this.setState({ pristine: false });
      },
      { once: true }
    );
  }

  /**
   * For at kunne svare med tal på keyboardet
   * Tager højde for modifier keys (alt, ctrl, meta)
   */
  onKeydown(e) {
    if (!this.state.imgOpen && document.activeElement.tagName !== 'TEXTAREA') {
      let answer = Number(e.key),
        keys = [1, 2, 3];
      if (keys.includes(answer) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        this.onAnswer(answer);
      }
    }
  }

  /**
   * Ansvarlig for at fortælle redux at der er svaret
   * @param  {number} answer Det der er svaret (1, 2 el. 3)
   */
  onAnswer(answer) {
    let { answerQuestion, question, user, qn } = this.props;

    // If not already answered:
    if (!question.answer) {
      // Er svaret korrekt? Tager højde for flere korrekte svarmuligheder
      let correct;
      if (Array.isArray(question.correctAnswer)) {
        correct = question.correctAnswer.includes(answer) ? true : false;
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
  }

  /** Håndtering af pop-up af billeder **/
  onImgClick() {
    this.setState((prevState) => {
      return { imgOpen: !prevState.imgOpen };
    });
  }

  /**
   * Styrer input fra både kommentarer og rapport
   * Kaldes fra QuestionComments.js og QuestionReport.js
   * @param  {[type]} e     fra Semantic UI onClick
   * @param  {string} value teksten
   * @param  {string} name  navnet på input-feltet
   */
  onTextType(e, { value, name }) {
    this.setState({ [name]: value });
  }

  /** Vis/skjul formular til rapportering af spørgsmål */
  onReportToggle() {
    this.setState((prevState) => {
      return { reportOpen: !prevState.reportOpen };
    });
  }

  /** Håndter submit af rapport */
  onReportSubmit() {
    // TODO: CONNECT  TIL REDUX OG API
    console.log(this.state.report);
    this.setState({ report: '' });
  }

  /**
   * Håndtering af kommentarer. Er de synlige?
   */
  onCommentsToggle() {
    this.setState((prevState) => {
      return { commentsOpen: !prevState.commentsOpen };
    });
  }

  /**
   * Poster en kommentar.
   * De brugte props (edit/commentQuestion) er fra redux.
   */
  onCommentPost() {
    if (this.state.newComment.length >= 3) {
      if (this.state.editingComment) {
        /**
         *  Hvis vi er ved at rette i en kommentar
         *  (dvs. editingComment = dennes id.)
         */
        this.props.editComment(
          this.props.question._id,
          this.state.editingComment,
          this.state.newComment
        );
      } else {
        /**
         *  Det er en ny kommentar
         */
        this.props.commentQuestion(this.props.question._id, this.state.newComment);
      }
      this.setState({ newComment: '', editingComment: '' });
    }
  }

  /**
   * Slet kommentar. Fra redux
   */
  onDeleteComment(comment_id) {
    this.props.deleteComment(this.props.question._id, comment_id);
  }

  /**
   * Når der ønskes at ændre en kommentar.
   * Kaldes fra QuestionComments.js
   * @param  {object} comment Kommentaren der skal ændres.
   */
  onEditComment(comment) {
    this.setState({
      newComment: comment.comment,
      editingComment: comment._id
    });
  }

  /**
   * Fortryder ændring af kommentar
   */
  undoEditComment() {
    this.setState({ newComment: '', editingComment: '' });
  }

  /**
   * Ændring af specialer
   * @param {??}
   */
  onSpecialtiesEditToggle() {
    this.setState((prevState) => {
      return { editingSpecialties: !prevState.editingSpecialties };
    });
  }

  onEditSpecialty(e, { value }) {
    this.setState({ selectedSpecialties: value });
  }

  onSaveSpecialties() {
    this.props.editSpecialties(this.props.question._id, this.state.selectedSpecialties);
    this.setState({ editingSpecialties: false });
  }

  render() {
    let { question, user } = this.props,
      text = subSupScript(question.question);

    return (
      <Container className="question">
        <Segment>
          <Grid divided columns="equal" stackable={true}>
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
                    onClick={this.onImgClick}
                    imgOpen={this.state.imgOpen}
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
          <Divider />
          <QuestionMetadata
            question={question}
            onToggleSpecialties={this.onSpecialtiesEditToggle}
            selectedSpecialties={this.state.selectedSpecialties}
            editingSpecialties={this.state.editingSpecialties}
            onEditSpecialty={this.onEditSpecialty}
            onSaveSpecialties={this.onSaveSpecialties}
            user={user}
          />

          <Button basic onClick={this.onCommentsToggle}>
            {this.state.commentsOpen ? (
              <Translate id="question.hide_comments" data={{ n: question.comments.length }} />
            ) : (
              <Translate id="question.show_comments" data={{ n: question.comments.length }} />
            )}
          </Button>
          <Button basic floated="right" onClick={this.onReportToggle}>
            <Translate id="question.report_question" />
          </Button>
          {this.state.reportOpen && (
            <QuestionReport
              report={this.state.report}
              handleChange={this.onTextType}
              handleSubmit={this.onReportSubmit}
            />
          )}
          {this.state.commentsOpen && (
            <QuestionComments
              comments={question.comments}
              newComment={this.state.newComment}
              onCommentType={this.onTextType}
              onCommentPost={this.onCommentPost}
              onDeleteComment={this.onDeleteComment}
              onEditComment={this.onEditComment}
              editingComment={this.state.editingComment}
              undoEditComment={this.undoEditComment}
              user={user}
            />
          )}
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
  editSpecialties: PropTypes.func
};

export default connect(
  null,
  actions
)(Question);
