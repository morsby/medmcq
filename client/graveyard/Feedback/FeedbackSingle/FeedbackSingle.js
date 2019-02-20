import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import * as actions from '../../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Translate } from 'react-localize-redux';

import { Container, Segment } from 'semantic-ui-react';
import FeedbackNavigation from '../FeedbackNavigation';

import FeedbackComment from './FeedbackComment/FeedbackComment';
import FeedbackCommentPost from './FeedbackComment/FeedbackCommentPost';
import FeedbackSingleContent from './FeedbackSingleContent';

import LoadingPage from '../../Misc/Pages/LoadingPage';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

import { smoothScroll } from '../../../utils/quiz';

class FeedbackSingle extends Component {
    // TODO: Få component til at opdatere selv ved dybt nested ny kommentar.
    state = { replyId: null, replySlug: null };

    constructor(props) {
        super(props);

        this.onReply = this.onReply.bind(this);
        this.onVote = this.onVote.bind(this);
        this.handleReplyReset = this.handleReplyReset.bind(this);
    }

    componentDidMount() {
        this.props.fetchFeedbackSpecific(this.pathId());
    }

    onReply(id, slug) {
        this.setState({ replyId: id, replySlug: slug });
        smoothScroll(null, 'down');
    }

    pathId() {
        return this.props.match.params.id;
    }

    onVote(val) {
        if (
            !this.props.votedFor.hasOwnProperty(
                this.props.feedbackSingle.feedback._id
            )
        ) {
            this.props.voteFeedback(
                this.props.feedbackSingle.feedback._id,
                val
            );
        }
    }

    handleReplyReset() {
        this.setState({ replyId: null, replySlug: null });
    }

    render() {
        let { feedbackSingle, votedFor } = this.props;
        let { replyId, replySlug } = this.state;

        let currId = feedbackSingle.hasOwnProperty('feedback')
            ? feedbackSingle.feedback._id
            : null;

        if (!currId || this.pathId() !== currId) {
            return <LoadingPage />;
        }

        let feedback = feedbackSingle.feedback,
            comments = feedbackSingle.comments;

        votedFor = votedFor.hasOwnProperty(feedback._id)
            ? votedFor[feedback._id]
            : undefined;

        return (
            <div className="flex-container">
                <Header />
                <Container className="content">
                    <FeedbackNavigation
                        id={feedback._id}
                        title={feedback.title}
                    />
                    <FeedbackSingleContent
                        feedback={feedback}
                        handleVote={this.onVote}
                        votedFor={votedFor}
                    />

                    <Segment>
                        <h4>
                            <Translate id="feedbackSingle.comments" />
                        </h4>
                        {comments.map(comment => {
                            return (
                                <FeedbackComment
                                    comment={comment}
                                    key={comment._id}
                                    onReply={this.onReply}
                                    replyId={replyId}
                                />
                            );
                        })}
                    </Segment>
                    <FeedbackCommentPost
                        feedbackId={feedback._id}
                        replyId={replyId}
                        replySlug={replySlug}
                        replyReset={this.handleReplyReset}
                    />
                </Container>
                <Footer />
            </div>
        );
    }
}

/**
 * Alle props er fra redux
 */
FeedbackSingle.propTypes = {
    /**
     * Funktion der henter feedback-forslaget hvis der tilgås direkte url
     */
    fetchFeedbackSpecific: PropTypes.func,

    /**
     * Selve forslaget
     */
    feedbackSingle: PropTypes.object,

    /**
     * object der indeholder ids der er stemt på og hvad der er stemt
     */
    votedFor: PropTypes.object,

    /**
     * func der står for at stemme
     */
    voteFeedback: PropTypes.func,

    /**
     * Fra react router
     */
    match: ReactRouterPropTypes.match,
};

function mapStateToProps(state) {
    return {
        feedbackSingle: state.feedback.feedbackSingle,
        votedFor: state.feedback.votedFor,
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(FeedbackSingle)
);
