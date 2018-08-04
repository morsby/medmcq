import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router';

import _ from 'lodash';

import { urls } from '../common';

import { Container } from 'semantic-ui-react';

import FeedbackNavigation from './FeedbackNavigation';
import FeedbackListItem from './FeedbackListItem';
import Footer from './Footer';

class FeedbackList extends Component {
	constructor(props) {
		super(props);

		this.state = { sortBy: 'votes', order: 'desc' };

		this.handleClick = this.handleClick.bind(this);
	}

	componentWillMount() {
		this.props.fetchFeedback();
	}

	handleClick(id) {
		this.props.history.push(`${urls.feedback}/${id}`);
	}

	sortBy(key) {
		if (key === this.state.sortBy) {
			let order = this.state.order === 'desc' ? 'asc' : 'desc';
			this.setState({ order });
		} else {
			this.setState({ sortBy: key });
		}
	}

	render() {
		let sortedFeedback = _.orderBy(
			this.props.feedback,
			this.state.sortBy,
			this.state.order
		);

		return (
			<div className="flex-container">
				<Container className="content">
					<FeedbackNavigation />
					<h1>Feedback og hjælp</h1>
					<p>
						Her på siden er der en oversigt over de lidt skjulte
						funktioner, denne app har – samt mulighed for at komme
						med forslag til forbedringer (og se, bedømme og
						kommentere forslag, andre har stillet).
					</p>

					<p>
						Sorter feedback efter{' '}
						<span
							style={{ fontWeight: 'bold' }}
							onClick={() => this.sortBy('date')}
						>
							dato
						</span>{' '}
						eller{' '}
						<span
							style={{ fontWeight: 'bold' }}
							onClick={() => this.sortBy('votes')}
						>
							popularitet
						</span>
					</p>

					{sortedFeedback.map(e => {
						return (
							<FeedbackListItem
								key={e._id}
								feedback={e}
								handleClick={this.handleClick}
							/>
						);
					})}
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
	)(FeedbackList)
);
