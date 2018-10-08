import React, { Component } from "react";
import { connect } from "react-redux";

import { urls } from "../../utils/common";

import { Container, Button } from "semantic-ui-react";

import Header from "../Misc/Header";
import PrintDisplayQuestion from "./PrintDisplayQuestion";

// TODO: Tillad valg af spørgsmål herfra (inkl. alle spørgsmål)

class Print extends Component {
    state = { showCorrect: false };

    constructor(props) {
        super(props);

        this.toggleAnswers = this.toggleAnswers.bind(this);
    }

    toggleAnswers() {
        this.setState((prevState, props) => {
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
                <Header noPrint />
                <Container className="content print">
                    <div className="hide-on-print">
                        <Button.Group className="hide-on-print">
                            <Button
                                className="primary"
                                onClick={this.toggleAnswers}
                            >
                                {showCorrect ? "Skjul" : "Vis"} rigtige svar
                            </Button>
                            <Button
                                className="hide-on-print"
                                onClick={() => window.print()}
                            >
                                Print spørgsmål
                            </Button>
                        </Button.Group>
                        <Button
                            color="yellow"
                            floated="right"
                            onClick={() => this.handleNavigation("quiz")}
                        >
                            Vend tilbage til quizzen
                        </Button>
                    </div>

                    {questions.map((q, i) => {
                        return (
                            <div className="avoid-page-break" key={q._id}>
                                <h3>Spørgsmål {i + 1}</h3>
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

function mapStateToProps(state) {
    return {
        questions: state.questions
    };
}

export default connect(
    mapStateToProps,
    null
)(Print);
