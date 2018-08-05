import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';

import { Container, Segment } from 'semantic-ui-react';
import FeedbackComment from './FeedbackComment';
import FeedbackCommentPost from './FeedbackCommentPost';
import FeedbackSingleContent from './FeedbackSingleContent';
import FeedbackNavigation from './FeedbackNavigation';
import Footer from './Footer';

class FeedbackSingle extends Component {
	constructor(props) {
		super(props);
		this.state = { replyId: null, replySlug: null };

		this.onReply = this.onReply.bind(this);
		this.onVote = this.onVote.bind(this);
	}

	componentWillMount() {
		this.props.fetchFeedbackSpecific(this.props.match.params.id);
	}

	onReply(id, slug) {
		this.setState({ replyId: id, replySlug: slug });
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

	render() {
		let feedback = this.props.feedbackSingle.feedback,
			comments = this.props.feedbackSingle.comments,
			votedFor = this.props.votedFor.hasOwnProperty(feedback._id)
				? this.props.votedFor[feedback._id]
				: undefined;

		return (
			<div className="flex-container">
				<Container className="content">
					<FeedbackNavigation
						id={feedback._id}
						title={feedback.title}
					/>
					<FeedbackSingleContent
						id={feedback._id}
						title={feedback.title}
						date={feedback.date}
						text={feedback.text}
						votes={feedback.votes}
						handleVote={this.onVote}
						votedFor={votedFor}
					/>

					<Segment>
						<h4>Kommentarer</h4>
						{comments.map(comment => {
							return (
								<FeedbackComment
									comment={comment}
									key={comment._id}
									onReply={this.onReply}
								/>
							);
						})}
					</Segment>
					<FeedbackCommentPost
						feedbackId={feedback._id}
						replyId={this.state.replyId}
						replySlug={this.state.replySlug}
					/>
				</Container>
				<Footer />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		feedbackSingle: state.feedback.feedbackSingle,
		votedFor: state.feedback.votedFor
	};
}

export default connect(
	mapStateToProps,
	actions
)(FeedbackSingle);
