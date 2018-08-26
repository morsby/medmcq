import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import marked from "marked";

import { imageURL, breakpoints } from "../../utils/common";

import {
    Container,
    Grid,
    Divider,
    Dimmer,
    Loader,
    Segment,
    Responsive
} from "semantic-ui-react";

import QuestionAnswerButtons from "./QuestionAnswerButtons";
import QuestionImage from "./QuestionImage";
import QuestionMetadata from "./QuestionMetadata";

class Question extends Component {
    state = { imgOpen: false, pristine: true };

    constructor(props) {
        super(props);

        this.onKeydown = this.onKeydown.bind(this);
        this.onImgClick = this.onImgClick.bind(this);
        this.onImgClose = this.onImgClose.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.onKeydown);
        this.mouseMover();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeydown);
    }

    componentWillUpdate(nextProps, nextState) {
        // For at forhindre lightbox i at være åben på tværs af navigationer
        if (this.props.qn !== nextProps.qn) {
            this.setState({ imgOpen: false, pristine: true });
            this.mouseMover();
        }
    }

    mouseMover() {
        document.addEventListener(
            "mousemove",
            () => {
                this.setState({ pristine: false });
            },
            { once: true }
        );
    }

    onKeydown(e) {
        if (!this.state.imgOpen) {
            let answer = Number(e.key),
                keys = [1, 2, 3];
            if (keys.includes(answer)) {
                this.onAnswer(answer);
            }
        }
    }

    onAnswer(answer) {
        let { answerQuestion, questions, qn } = this.props;

        // If not already answered:
        if (!questions[qn].answer) {
            // Call answerQuestion action with id (passed from parent) and answer
            answerQuestion(
                questions[qn]._id,
                answer,
                {
                    qn: qn,
                    correct: questions[qn].correctAnswer === answer
                },
                questions[qn].semester
            );
        }
    }

    onImgClose() {
        this.setState({ imgOpen: false });
    }

    onImgClick() {
        this.setState({ imgOpen: true });
    }

    render() {
        let question = this.props.questions[this.props.qn];

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
                                    style={{ fontSize: "18px" }}
                                    dangerouslySetInnerHTML={{
                                        __html: marked(question.question)
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
                                        img={imageURL(question.image_id)}
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
                </Segment>
                <Divider hidden />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return { questions: state.questions };
}

export default connect(
    mapStateToProps,
    actions
)(Question);
