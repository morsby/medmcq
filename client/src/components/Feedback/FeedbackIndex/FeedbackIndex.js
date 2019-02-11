import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { withRouter } from 'react-router';

import { urls } from '../../../utils/common';

import { Container } from 'semantic-ui-react';

import FeedbackNavigation from '../FeedbackNavigation';
import FeedbackList from './FeedbackList/FeedbackList';

import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

/**
 * Component der viser liste over de aktuelle feedbacks (og en henvisning til
 * github)
 * Props ses i bunden, stammer alle fra redux.
 */
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
                        du tage kontakt på sidens repository på{' '}
                        <a href="https://github.com/Morsby/au-medicin-mcq">
                            GitHub
                        </a>
                        .
                    </p>
                </Container>
                <Footer />
            </div>
        );
    }
}

FeedbackIndex.propTypes = {
    /**
     * Array af feedback-forslag, passes til FeedbackList
     * Fra redux
     */
    feedback: PropTypes.array,

    /**
     * Funktion der henter alle feedbackforslag (i grov form)
     * Fra redux
     */
    fetchFeedback: PropTypes.func,

    /**
     * Funktion der henter kommentarer, tekst, m.v. til ét forslag
     * Fra redux
     */
    fetchFeedbackSpecific: PropTypes.func,

    /**
     * Fra react-router-dom
     */
    history: ReactRouterPropTypes.history,
};

function mapStateToProps(state) {
    return {
        feedback: state.feedback.feedback,
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(FeedbackIndex)
);
