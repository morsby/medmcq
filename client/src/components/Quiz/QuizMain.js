import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import Swipeable from "react-swipeable";
import QuizLoader from "./QuizLoader";
import Question from "./Question";
import QuizNavigator from "./QuizNavigator";
import QuizSummary from "./QuizSummary";

import Footer from "../Misc/Footer";

import { smoothScroll } from "../../utils/quiz";
import { urls } from "../../utils/common";
import QuizHeader from "../Misc/QuizHeader";

const flickNumber = 0.1;


class QuizMain extends Component {
    state = { qn: 0 };

    constructor(props) {
        super(props);

        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.navigateToPage = this.navigateToPage.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.swiped = this.swiped.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeydown);

        if (this.props.settings.questions.length === 0) {
            this.navigateToPage("root");
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeydown);
    }

    onKeydown(e) {
        // TODO: DER SKAL TILFØJES AT HVIS COMMENT BOX ER AKTIV, SKAL IF IKKE KØRE = ARROWKEYS LÅSES.

        // Navigation
        let qn = this.state.qn,
            max = this.props.questions.length;
        if (document.activeElement.tagName === "TEXTAREA") return;
        if (e.key === "ArrowLeft") {
            if (qn > 0) this.onChangeQuestion(this.state.qn - 1);
        } else if (e.key === "ArrowRight") {
            if (qn < max - 1) this.onChangeQuestion(this.state.qn + 1);
        }
    }

    onChangeQuestion(q) {
        this.setState({
            qn: q
        });

        smoothScroll();
    }

    // swipeChecker(e, deltaX, deltaY, isFlick, velocity) {
    //     console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
    //   }

    navigateToPage(path) {
        this.props.history.push(urls[path]);
    }

    getQuestions() {
        let { getQuestions, settings } = this.props;
        getQuestions(settings);
        this.setState({ qn: 0 });
    }

    swiped(e, deltaX, isFlick) {
        let min = 0,
            max = this.props.questions.length,
            move;

        if (deltaX > 300) {
            move = this.state.qn + 1;
        }
        if (deltaX < -300) {
            move = this.state.qn - 1;
        }
        if (move >= min && move < max) this.onChangeQuestion(move);
    }

    render() {
        let { questions, settings, answers, user } = this.props,
            { qn } = this.state;

        if (!questions || settings.isFetching)
            return (
                <QuizLoader
                    handleClick={this.getQuestions}
                    handleAbort={() => this.navigateToPage("root")}
                />
            );

        return (
            <div className="flex-container">

                <QuizHeader />

                <div className="content">
                    <QuizNavigator
                        clickHandler={this.onChangeQuestion}
                        qn={qn}
                        qmax={questions.length}
                        position="top"
                    />

                    <Swipeable
                        onSwipedLeft={this.swiped}
                        onSwipedRight={this.swiped}
                        flickThreshold={flickNumber}
                        // onSwiped={this.swipeChecker}
                    >
                        <Question qn={qn} questions={questions} user={user} />
                    </Swipeable>

                    <QuizNavigator
                        clickHandler={this.onChangeQuestion}
                        qn={qn}
                        qmax={questions.length}
                    />

                    <QuizSummary
                        questions={questions}
                        answers={answers}
                        clickHandler={this.onChangeQuestion}
                    />

                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        questions: state.questions,
        answers: state.answers,
        settings: state.settings,
        user: state.auth.user
    };
}

export default connect(
    mapStateToProps,
    actions
)(QuizMain);
