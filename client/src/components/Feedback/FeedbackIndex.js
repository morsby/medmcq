import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { withRouter } from "react-router";

import { urls } from "../../utils/common";

import { Container, Message } from "semantic-ui-react";

import FeedbackNavigation from "./FeedbackNavigation";
import FeedbackList from "./FeedbackList";

import Header from "../Misc/Header";
import Footer from "../Misc/Footer";

class FeedbackIndex extends Component {
    constructor(props) {
        super(props);

        this.getSpecificFeedback = this.getSpecificFeedback.bind(this);
    }

    componentDidMount() {
        this.props.fetchFeedback();
    }

    getSpecificFeedback(id) {
        this.props.fetchFeedbackSpecific(id);
        this.props.history.push(`${urls.feedback}/${id}`);
    }

    render() {
        return (
            <div className="flex-container">
                <Header />
                <Container className="content">
                    <FeedbackNavigation />
                    <h1>Feedback</h1>

                    <FeedbackList
                        feedback={this.props.feedback}
                        getSpecificFeedback={this.getSpecificFeedback}
                    />

                    <h2>Vil du hjælpe?</h2>
                    <p>
                        Har du lyst til at hjælpe med vedligehold af siden, kan
                        du tage kontakt på sidens repository på{" "}
                        <a href="https://github.com/Morsby/au-medicin-mcq">
                            GitHub
                        </a>.
                    </p>
                    <h2>Privatliv og cookies</h2>
                    <p>
                        Siden benytter open source tracking i form af Matomo.
                        Denne er indstillet til at respektere browser-opt-out,
                        ikke at sætte cookies og at anonymisere IP-adresser. Det
                        vil sige, at du er fuldstændig anonym. Data gemmes i min
                        egen database og deles ikke. Data bruges til at skabe et
                        (dermed underestimeret) overslag over brugen af siden.
                    </p>
                    <p>
                        Siden benytter ingen cookies, med mindre du opretter en
                        bruger og logger ind. I dette tilfælde sættes en cookie,
                        der husker, at du er logget ind til næste gang.
                    </p>
                </Container>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        feedback: state.feedback.feedback
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(FeedbackIndex)
);
