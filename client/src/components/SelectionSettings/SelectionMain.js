import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import {
    Container,
    Header,
    Dropdown,
    Divider,
    Button,
    Message
} from "semantic-ui-react";

import SelectionNSelector from "./SelectionNSelector";
import SelectionSetSelector from "./SelectionSetSelector";
import SelectionSpecialtiesSelector from "./SelectionSpecialtiesSelector";
import SelectionTypeSelector from "./SelectionTypeSelector";
import SelectionMessage from "./SelectionMessage";

import Footer from "../Misc/Footer";
import { default as UIHeader } from "../Misc/Header";

import { semestre, urls } from "../../utils/common";
import { selectQuestions } from "../../utils/quiz";

class SelectionMain extends Component {
    state = { err: [] };

    constructor(props) {
        super(props);

        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onSettingsChange(e, { name, value }) {
        this.setState({ err: [] });
        this.props.changeSettings({ type: name, value });
    }

    handleSubmit(type) {
        let err = [];
        // VALIDATION
        // Semester
        if (!this.props.settings.semester) {
            err.push("Du skal vælge et semester først!");
        }

        //Specialer
        if (
            this.props.settings.type === "specialer" &&
            this.props.settings.specialer.length === 0
        ) {
            err.push("Du skal vælge mindst ét speciale.");
        }

        // Sæt
        if (this.props.settings.type === "set" && !this.props.settings.set) {
            err.push("Du skal vælge et sæt for at kunne starte!");
            if (this.props.settings.semester === 11) {
                err.push("You have to select a set to start.");
            }
        }
        // Findes der spørgsmål?
        if (this.props.settings.questions.length === 0) {
            err.push("Der er ingen spørgsmål for det valgte semester.");
            if (this.props.settings.semester === 11) {
                err.push("There are no questions for the selected semester.");
            }
        }

        // tjek for fejl, start eller ej
        if (err.length === 0) {
            if (type === "new") {
                this.props.getQuestions(
                    this.props.settings.type,
                    selectQuestions(
                        this.props.settings,
                        this.props.auth.user.answeredQuestions
                    )
                );
            }
            this.props.history.push(urls.quiz);
        } else {
            this.setState({ err });
        }
    }

    render() {
        let {
            semester,
            specialer,
            type,
            n,
            onlyNew,
            questions,
            sets,
            set
        } = this.props.settings;
        let user, answeredQuestions;
        if (this.props.auth.user) {
            user = this.props.auth.user;
            answeredQuestions = user.answeredQuestions[semester];
        } else {
            user = null;
        }

        return (
            <div className="flex-container">
                <UIHeader />
                <Container className="content">
                    <Header as="h1">
                        MCQ'er fra kandidaten på medicin ved Aarhus Universitet
                    </Header>
                    <Header as="h3">Indtast dine valg nedenfor</Header>
                    <Dropdown
                        placeholder="Vælg semester"
                        fluid
                        selection
                        options={semestre}
                        name="semester"
                        value={semester}
                        onChange={this.onSettingsChange}
                    />
                    <Divider hidden />
                    <SelectionTypeSelector
                        handleClick={this.onSettingsChange}
                        type={type}
                    />

                    <Divider hidden />

                    {type !== "set" && (
                        <SelectionNSelector
                            n={n}
                            onlyNew={onlyNew}
                            onChange={this.onSettingsChange}
                            total={questions.length}
                            user={user}
                            semester={semester}
                        />
                    )}

                    {type === "set" && (
                        <SelectionSetSelector
                            questions={questions}
                            sets={sets}
                            activeSet={set}
                            semester={semester}
                            answeredQuestions={answeredQuestions}
                            onChange={this.onSettingsChange}
                        />
                    )}

                    {type === "specialer" && (
                        <SelectionSpecialtiesSelector
                            semester={semester}
                            valgteSpecialer={specialer}
                            onChange={this.onSettingsChange}
                        />
                    )}
                    <Divider hidden />

                    {this.state.err.length > 0 && (
                        <Message negative>
                            {this.state.err.map(err => {
                                return <p key={err}>{err}</p>;
                            })}
                        </Message>
                    )}
                    <SelectionMessage user={user} type={type} />
                    <Button onClick={() => this.handleSubmit("new")}>
                        Start!
                    </Button>
                    {this.props.answers.length > 0 && (
                        <Button onClick={() => this.handleSubmit("cont")}>
                            Fortsæt med igangværende spørgsmål
                        </Button>
                    )}
                </Container>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        settings: state.settings,
        answers: state.answers,
        auth: state.auth
    };
}

export default connect(
    mapStateToProps,
    actions
)(SelectionMain);
