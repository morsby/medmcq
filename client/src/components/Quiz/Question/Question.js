import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import marked from 'marked';

import _ from 'lodash';

import { imageURL, breakpoints } from '../../../utils/common';
import { subSupScript } from '../../../utils/quiz';

import { Container, Grid, Divider, Segment, Button, Responsive } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

import QuestionAnswerButtons from './QuestionAnswerButtons';
import QuestionImage from './QuestionImage';
import QuestionVoting from './QuestionVoting';
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
     * Er der sendt en rapport?
     * @type {Boolean}
     */
    reportSent: false,

    /**
     * Er kommentarer vist?
     * @type {Boolean}
     */
    publicCommentsOpen: false,

    /**
     * Er kommentarer vist?
     * @type {Boolean}
     */
    privateCommentsOpen: false,

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

    this.onKeydown = this.onKeydown.bind(this);
    this.onImgClick = this.onImgClick.bind(this);
    this.onTextType = this.onTextType.bind(this);
    this.onReportToggle = this.onReportToggle.bind(this);
    this.onReportSubmit = this.onReportSubmit.bind(this);
    this.onPublicCommentsToggle = this.onPublicCommentsToggle.bind(this);
    this.onPrivateCommentsToggle = this.onPrivateCommentsToggle.bind(this);
    this.onCommentPost = this.onCommentPost.bind(this);
    this.onDeleteComment = this.onDeleteComment.bind(this);
    this.onEditComment = this.onEditComment.bind(this);
    this.undoEditComment = this.undoEditComment.bind(this);
    this.onAnswer = this.onAnswer.bind(this);

    this.onSpecialtiesEditToggle = this.onSpecialtiesEditToggle.bind(this);
    this.onEditSpecialty = this.onEditSpecialty.bind(this);
    this.onSaveSpecialties = this.onSaveSpecialties.bind(this);

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
        imgOpen: false,
        reportOpen: false,
        reportSent: false,
        report: '',
        // Luk comments efter spørgsmål skift
        publicCommentsOpen: false,
        privateCommentsOpen: false,
        // ==================================
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
    if (
      !this.state.imgOpen &&
      !(
        document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT'
      ) &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      let answer = Number(e.key),
        keys = [1, 2, 3];
      if (keys.includes(answer)) {
        this.onAnswer(answer);
      }
    }
  }

  handleResize = () => this.setState({ width: window.innerWidth });

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
    this.props.questionReport({
      type: 'error_report',
      data: { report: this.state.report, question: this.props.question }
    });
    this.setState({ report: '', reportSent: true });
  }

  onPublicCommentsToggle() {
    this.setState((prevState) => {
      return { publicCommentsOpen: !prevState.publicCommentsOpen, privateCommentsOpen: false };
    });
  }

  onPrivateCommentsToggle() {
    this.setState((prevState) => {
      return { privateCommentsOpen: !prevState.privateCommentsOpen, publicCommentsOpen: false };
    });
  }

  /**
   * Poster en kommentar.
   * De brugte props (edit/commentQuestion) er fra redux.
   */
  onCommentPost(isPrivate) {
    if (this.state.newComment.length >= 3) {
      if (this.state.editingComment) {
        /**
         *  Hvis vi er ved at rette i en kommentar
         *  (dvs. editingComment = dennes id.)
         */
        this.props.editComment(
          this.props.question._id,
          this.state.editingComment,
          this.state.newComment,
          isPrivate
        );
      } else {
        /**
         *  Det er en ny kommentar
         */
        this.props.commentQuestion(this.props.question._id, this.state.newComment, isPrivate);
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
    const { question, user } = this.props,
      { width } = this.state,
      text = subSupScript(question.question);
    let privateComments = [];
    let publicComments = [];
    question.comments.forEach((comment) => {
      if (user) {
        if (comment.private && comment.user === user.username) {
          privateComments.push(comment);
        }
      }
      if (!comment.private) {
        publicComments.push(comment);
      }
    });

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
          <div>
            <Translate id="questionMetadata.specialty" /> {question.specialty.join(', ')}
          </div>
          <div>
            <Translate id="questionMetadata.tags" /> {question.tags.join(', ')}
          </div>
          <div>
            <Translate id="questionMetadata.set" />{' '}
            {question.examSeason === 'F' ? (
              <Translate id="questionMetadata.set_season.F" />
            ) : (
              <Translate id="questionMetadata.set_season.E" />
            )}{' '}
            {question.examYear}
          </div>
          <Divider />
          <Button
            color={this.state.publicCommentsOpen ? 'green' : null}
            basic
            onClick={this.onPublicCommentsToggle}
          >
            {this.state.publicCommentsOpen ? (
              <Translate id="question.hide_public_comments" data={{ n: publicComments.length }} />
            ) : (
              <Translate id="question.show_public_comments" data={{ n: publicComments.length }} />
            )}
          </Button>
          {user && (
            <Button
              color={this.state.privateCommentsOpen ? 'green' : null}
              basic
              onClick={this.onPrivateCommentsToggle}
            >
              {this.state.privateCommentsOpen ? (
                <Translate
                  id="question.hide_private_comments"
                  data={{ n: privateComments.length }}
                />
              ) : (
                <Translate
                  id="question.show_private_comments"
                  data={{ n: privateComments.length }}
                />
              )}
            </Button>
          )}
          {width <= 700 && <Divider hidden />}
          <Button
            basic
            color="orange"
            floated={width > 700 ? 'right' : null}
            onClick={this.onReportToggle}
          >
            <Translate id="question.report_question" />
          </Button>
          {this.state.reportOpen && (
            <QuestionReport
              report={this.state.report}
              handleChange={this.onTextType}
              handleSubmit={this.onReportSubmit}
              reportSent={this.state.reportSent}
            />
          )}
          {this.state.publicCommentsOpen && (
            <QuestionComments
              comments={publicComments}
              newComment={this.state.newComment}
              onCommentType={this.onTextType}
              onCommentPost={() => this.onCommentPost(false)}
              onDeleteComment={this.onDeleteComment}
              onEditComment={this.onEditComment}
              editingComment={this.state.editingComment}
              undoEditComment={this.undoEditComment}
              user={user}
              private={false}
            />
          )}
          {this.state.privateCommentsOpen && (
            <QuestionComments
              comments={privateComments}
              newComment={this.state.newComment}
              onCommentType={this.onTextType}
              onCommentPost={() => this.onCommentPost(true)}
              onDeleteComment={this.onDeleteComment}
              onEditComment={this.onEditComment}
              editingComment={this.state.editingComment}
              undoEditComment={this.undoEditComment}
              user={user}
              privateComment={true}
            />
          )}
          {user && <Divider />}
          {user && (
            <>
              <QuestionVoting question={question} user={user} />
            </>
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
  editSpecialties: PropTypes.func
};

export default connect(
  null,
  actions
)(Question);
