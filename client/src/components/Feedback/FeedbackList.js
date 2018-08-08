import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router';

import _ from 'lodash';

import { urls } from '../../common';

import { Container, List } from 'semantic-ui-react';

import FeedbackNavigation from './FeedbackNavigation';
import FeedbackListItem from './FeedbackListItem';
import Footer from '../Misc/Footer';

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
		this.props.fetchFeedbackSpecific(id);
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

					<h2>Smarte/skjulte funktioner</h2>
					<p>
						Siden gemmer mange ting lokalt på din enhed (ikke som
						cookies) - eksempelvis de spørgsmål, du er i gang med
						(hvis du har svaret på minimum ét spørgsmål), dit
						semester og andre valg, du foretager på siden – dette er
						så du nemt kan vende tilbage til siden. Hvis du
						"stemmer" på feedback-forslag, bliver dette også gemt,
						så der ikke kan stemmes mere end én gang per forslag.
					</p>
					<List bulleted>
						<List.Item>
							På en computer kan du
							<List>
								<List.Item>
									navigere mellem spørgsmål med piletasterne
								</List.Item>
								<List.Item>
									besvare spørgsmål ved brug af tallene 1, 2
									og 3 for hhv. svarmulighed A, B og C.
								</List.Item>
							</List>
						</List.Item>
						<List.Item>
							På en telefon kan du
							<List>
								<List.Item>
									navigere mellem spørgsmål ved at swipe
									(virker måske også på en touchskærms-pc?)
								</List.Item>
							</List>
						</List.Item>
					</List>

					<h2>Feedback</h2>
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
					<h2>Vil du hjælpe?</h2>
					<p>
						Har du lyst til at hjælpe med vedligehold af siden, kan
						du tage kontakt på sidens repository på{' '}
						<a href="https://github.com/Morsby/au-medicin-mcq">
							GitHub
						</a>.
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
	)(FeedbackList)
);
