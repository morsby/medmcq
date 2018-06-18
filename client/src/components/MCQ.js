import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { Redirect } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import Swipeable from 'react-swipeable';
import Question from './Question';
import QuestionNavigator from './QuestionNavigator';
import Summary from './Summary';
import MainNavigation from './MainNavigation';
import Footer from './Footer';

import { selectQuestions } from '../common';

class MCQ extends Component {
	constructor(props) {
		super(props);

		this.state = { qn: 0, toSelection: true };
		this.onNavigate = this.onNavigate.bind(this);
		this.toSelection = this.toSelection.bind(this);
		this.getQuestions = this.getQuestions.bind(this);
		this.swiped = this.swiped.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
	}

	componentWillMount() {
		if (this.props.settings.questions.length > 0) {
			this.setState({ toSelection: false });
		}
	}

	componentDidMount() {
		document.addEventListener('keydown', this.onKeydown);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeydown);
	}

	onKeydown(e) {
		// Navigation
		let qn = this.state.qn,
			max = this.props.questions.length;
		if (e.key === 'ArrowLeft') {
			if (qn > 0) this.onNavigate(this.state.qn - 1);
		} else if (e.key === 'ArrowRight') {
			if (qn < max - 1) this.onNavigate(this.state.qn + 1);
		}
	}

	onNavigate(q) {
		this.setState({
			qn: q
		});

		const smoothScroll = h => {
			let top = window.pageYOffset || document.documentElement.scrollTop;
			let px = 20;
			let i = h || top;
			if (i > px) {
				setTimeout(() => {
					window.scrollTo(0, i);
					smoothScroll(i - px);
				}, 10);
			} else {
				window.scrollTo(0, 0);
			}
		};

		smoothScroll();
	}

	toSelection() {
		this.setState({ toSelection: true });
	}

	getQuestions() {
		this.props.getQuestions(
			this.props.settings.type,
			selectQuestions(this.props.settings)
		);
		this.setState({ qn: 0 });
	}

	swiped(e, deltaX, isFlick) {
		let min = 0,
			max = this.props.questions.length,
			move;

		if (deltaX > 0) {
			move = this.state.qn + 1;
		}
		if (deltaX < 0) {
			move = this.state.qn - 1;
		}
		if (move >= min && move < max) this.onNavigate(move);
	}

	render() {
		if (this.state.toSelection) return <Redirect to="/" />;
		if (!this.props.questions || this.props.settings.isFetching)
			return (
				<Dimmer active page>
					<Loader>Henter spørgsmål ...</Loader>
				</Dimmer>
			);
		return (
			<div className="flex-container">
				<div className="content">
					<QuestionNavigator
						clickHandler={this.onNavigate}
						qn={this.state.qn}
						qmax={this.props.questions.length}
						fixed
						position="top"
					/>
					<Swipeable
						onSwipedLeft={this.swiped}
						onSwipedRight={this.swiped}
					>
						<Question qn={this.state.qn} />
					</Swipeable>
					<QuestionNavigator
						clickHandler={this.onNavigate}
						qn={this.state.qn}
						qmax={this.props.questions.length}
					/>
					<Summary
						questions={this.props.questions}
						answers={this.props.answers}
						clickHandler={this.onNavigate}
					/>
					<MainNavigation
						toSelection={this.toSelection}
						newQuestions={this.getQuestions}
						set={this.props.settings.type}
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
		settings: state.settings
	};
}

export default connect(
	mapStateToProps,
	actions
)(MCQ);
