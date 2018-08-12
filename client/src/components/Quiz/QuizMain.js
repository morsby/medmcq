import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Swipeable from 'react-swipeable';
import QuizLoader from './QuizLoader';
import Question from './Question';
import QuizNavigator from './QuizNavigator';
import Summary from './QuizSummary';
import QuizFooter from './QuizFooter';

import Footer from '../Misc/Footer';

import { selectQuestions, smoothScroll } from '../../common';

class QuizMain extends Component {
	constructor(props) {
		super(props);

		this.state = { qn: 0 };
		this.onNavigate = this.onNavigate.bind(this);
		this.toSelection = this.toSelection.bind(this);
		this.getQuestions = this.getQuestions.bind(this);
		this.swiped = this.swiped.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
	}

	componentWillMount() {
		if (this.props.settings.questions.length === 0) {
			this.toSelection();
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

		smoothScroll();
	}

	toSelection() {
		this.props.history.push('/');
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
		if (!this.props.questions || this.props.settings.isFetching)
			return <QuizLoader handleClick={this.getQuestions} />;
		return (
			<div className="flex-container">
				<div className="content">
					<QuizNavigator
						clickHandler={this.onNavigate}
						qn={this.state.qn}
						qmax={this.props.questions.length}
						fixed
						position="top"
						style={{ top: '50px !important' }}
					/>
					<Swipeable
						onSwipedLeft={this.swiped}
						onSwipedRight={this.swiped}
					>
						<Question qn={this.state.qn} />
					</Swipeable>
					<QuizNavigator
						clickHandler={this.onNavigate}
						qn={this.state.qn}
						qmax={this.props.questions.length}
					/>
					<Summary
						questions={this.props.questions}
						answers={this.props.answers}
						clickHandler={this.onNavigate}
					/>
					<QuizFooter
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
)(QuizMain);
