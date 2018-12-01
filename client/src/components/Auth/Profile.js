import React, { Component } from "react";

import { connect } from "react-redux";
import * as actions from "../../actions";
import { urls, semestre } from "../../utils/common";
import { semesterIndices } from "../../utils/auth";
import _ from "lodash";

import { Container, Tab, List, Button, Divider } from "semantic-ui-react";

import Header from "../Misc/Header";
import Footer from "../Misc/Footer";

import ProfileAnswerDetails from "./ProfileAnswerDetails";

class Profile extends Component {
    constructor(props) {
        super(props);
        let { semester } = props.settings;

        this.state = {
            activeTab: semesterIndices(semester),
            details: true,
            hidden: null,
            semester: semester
        };
    }

    componentDidMount() {
        this.getQuestions(this.state.semester);
    }

    getQuestions = semester => {
        let answeredQuestions = _.get(
            this.props,
            ["auth", "user", "answeredQuestions", semester],
            {}
        );

        this.props.getAnsweredQuestions(answeredQuestions);
    };

    handleTabChange = (e, { activeIndex }) => {
        let semester = semesterIndices(activeIndex);
        this.getQuestions(semester);
        this.setState({ activeTab: activeIndex, semester: semester });
    };

    toggleDetails = () => {
        this.setState({ details: !this.state.details });
    };

    handleNavigation = path => {
        this.props.history.push(urls[path]);
    };

    startQuiz = ids => {
        this.props.getQuestions({ type: "ids" }, ids);
        this.handleNavigation("quiz");
    };

    generateTabContent = (performance, user) => {
        let totalAnswers = Object.keys(performance.answeredQuestions).length,
            { allRight, allWrong, mixed } = performance.summary;
        return (
            <div>
                <p>
                    <strong>
                        Du har svaret på {totalAnswers} forskellige spørgsmål
                    </strong>
                </p>
                <div>
                    <p>Af dem har du svaret</p>
                    <List bulleted className="analysis">
                        <List.Item>
                            <span>rigtigt</span> <em>hver</em> gang på{" "}
                            {allRight.length} spørgsmål
                        </List.Item>
                        <List.Item>
                            <span>forkert</span> <em>hver</em> gang på{" "}
                            {allWrong.length} spørgsmål
                        </List.Item>
                        <List.Item>
                            <span>både</span> rigtigt <em>og</em> forkert på{" "}
                            {mixed.length} spørgsmål
                        </List.Item>
                    </List>
                </div>
                <Divider hidden />
                <p>
                    Du har kommenteret på {user.comments.length} spørgsmål.{" "}
                    {user.comments.length > 0 && (
                        <a
                            className="click"
                            onClick={() => this.startQuiz(user.comments)}
                        >
                            Se om der er kommet nye kommentarer på disse
                            spørgsmål.
                        </a>
                    )}
                </p>
                <Divider hidden />
                <Button
                    onClick={this.toggleDetails}
                    disabled={totalAnswers === 0}
                >
                    {this.state.details ? "Skjul" : "Vis"} detaljer
                </Button>
            </div>
        );
    };

    render() {
        const { performance, user } = this.props.auth,
            semesters = _.map(semestre, "value");
        let panes = [];
        semesters.map(e =>
            panes.push({
                menuItem: `${e}. semester`,
                render: () => (
                    <Tab.Pane>
                        {this.generateTabContent(performance, user)}
                    </Tab.Pane>
                )
            })
        );

        return (
            <div className="flex-container">
                <Header />
                <Container className="content">
                    <h2>{user.username}</h2>
                    <Button
                        basic
                        color="yellow"
                        onClick={() => this.handleNavigation("editProfile")}
                    >
                        Rediger profil
                    </Button>
                    <Button
                        floated="right"
                        negative
                        onClick={() =>
                            (window.location.href = "/api/auth/logout")
                        }
                    >
                        Log ud
                    </Button>
                    <Divider hidden />
                    <p>
                        Herunder kan du se, hvordan du har klaret dig for hvert
                        semester
                    </p>
                    <Tab
                        panes={panes}
                        activeIndex={this.state.activeTab}
                        onTabChange={this.handleTabChange}
                    />

                    {this.state.details && (
                        <ProfileAnswerDetails
                            performance={performance}
                            filter={this.state.filter}
                        />
                    )}
                </Container>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        settings: state.settings
    };
}

export default connect(
    mapStateToProps,
    actions
)(Profile);
