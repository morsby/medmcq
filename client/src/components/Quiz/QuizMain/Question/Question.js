import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import marked from 'marked';

import { imageURL, breakpoints } from '../../../../utils/common';
import { subSupScript } from '../../../../utils/quiz';

import {
    Container,
    Grid,
    Divider,
    Dimmer,
    Loader,
    Segment,
    Button,
    Responsive,
} from 'semantic-ui-react';

import QuestionAnswerButtons from './QuestionAnswerButtons';
import QuestionImage from './QuestionImage';
import QuestionMetadata from './QuestionMetadata';
import QuestionComments from './QuestionComments';

class Question extends Component {
    state = {
        imgOpen: false,
        commentsOpen: false,
        newComment: '',
        editingComment: '',
        pristine: true,
    };

    constructor(props) {
        super(props);

        this.onKeydown = this.onKeydown.bind(this);
        this.onImgClick = this.onImgClick.bind(this);
        this.onImgClose = this.onImgClose.bind(this);
        this.onCommentsToggle = this.onCommentsToggle.bind(this);
        this.onCommentWrite = this.onCommentWrite.bind(this);
        this.onCommentPost = this.onCommentPost.bind(this);
        this.onDeleteComment = this.onDeleteComment.bind(this);
        this.onEditComment = this.onEditComment.bind(this);
        this.undoEdit = this.undoEdit.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.onKeydown);
        this.mouseMover();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeydown);
    }

    componentWillUpdate(nextProps, nextState) {
        // For at forhindre lightbox i at være åben på tværs af navigationer
        if (this.props.qn !== nextProps.qn) {
            this.setState({
                imgOpen: false,
                commentsOpen: false,
                newComment: '',
                editingComment: '',
                pristine: true,
            });
            this.mouseMover();
        }
    }

    mouseMover() {
        document.addEventListener(
            'mousemove',
            () => {
                this.setState({ pristine: false });
            },
            { once: true }
        );
    }

    onKeydown(e) {
        if (
            !this.state.imgOpen &&
            document.activeElement.tagName !== 'TEXTAREA'
        ) {
            let answer = Number(e.key),
                keys = [1, 2, 3];
            if (
                keys.includes(answer) &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.metaKey
            ) {
                this.onAnswer(answer);
            }
        }
    }

    onAnswer(answer) {
        let { answerQuestion, questions, qn, user } = this.props;

        // If not already answered:
        if (!questions[qn].answer) {
            // Call answerQuestion action with id (passed from parent) and answer

            let truthy;
            if (Array.isArray(questions[qn].correctAnswer)) {
                truthy = questions[qn].correctAnswer.includes(answer)
                    ? true
                    : false;
            } else {
                truthy = questions[qn].correctAnswer === answer;
            }

            answerQuestion(
                questions[qn]._id,
                answer,
                {
                    qn: qn,
                    correct: truthy,
                },
                questions[qn].semester,
                user
            );
        }
    }

    onImgClose() {
        this.setState({ imgOpen: false });
    }

    onImgClick() {
        this.setState({ imgOpen: true });
    }

    onCommentsToggle() {
        this.setState(prevState => {
            return { commentsOpen: !prevState.commentsOpen };
        });
    }

    onCommentWrite(e, { value }) {
        this.setState({ newComment: value });
    }

    onCommentPost() {
        if (this.state.newComment.length >= 3) {
            if (this.state.editingComment) {
                this.props.editComment(
                    this.props.questions[this.props.qn]._id,
                    this.state.editingComment,
                    this.state.newComment
                );
            } else {
                this.props.commentQuestion(
                    this.props.questions[this.props.qn]._id,
                    this.state.newComment
                );
            }
            this.setState({ newComment: '', editComment: '' });
        }
    }

    onDeleteComment(comment_id) {
        this.props.deleteComment(
            this.props.questions[this.props.qn]._id,
            comment_id
        );
    }

    onEditComment(comment) {
        this.setState({
            newComment: comment.comment,
            editingComment: comment._id,
        });
    }

    undoEdit() {
        this.setState({ newComment: '', editingComment: '' });
    }

    render() {
        let question = this.props.questions[this.props.qn],
            text = subSupScript(question.question),
            user = this.props.user;

        if (!this.props.questions.length > 0)
            return (
                <Dimmer active page>
                    <Loader>Henter spørgsmål ...</Loader>
                </Dimmer>
            );

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
                                            smartypants: true,
                                        }),
                                    }}
                                    ref={ref => (this._div = ref)}
                                />
                                <Responsive
                                    as="div"
                                    minWidth={breakpoints.mobile + 1}
                                >
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
                                        onClose={this.onImgClose}
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
                    <QuestionMetadata question={question} />

                    <Button basic onClick={this.onCommentsToggle}>
                        {this.state.commentsOpen ? 'Skjul' : 'Vis'} kommentarer
                        ({question.comments.length})
                    </Button>
                    {this.state.commentsOpen && (
                        <QuestionComments
                            comments={question.comments}
                            value={this.state.newComment}
                            onCommentWrite={this.onCommentWrite}
                            onCommentPost={this.onCommentPost}
                            onDeleteComment={this.onDeleteComment}
                            onEditComment={this.onEditComment}
                            editingComment={this.state.editingComment}
                            undoEdit={this.undoEdit}
                            user={user}
                        />
                    )}
                </Segment>
                <Divider hidden />
            </Container>
        );
    }
}

export default connect(
    null,
    actions
)(Question);
