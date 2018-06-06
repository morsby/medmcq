import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Container, Dimmer, Loader, Button } from 'semantic-ui-react';

import Question from './Question';
import QuestionNavigator from './QuestionNavigator';
import QuestionHeader from './QuestionHeader';
import Summary from './Summary';

class MCQ extends Component {
	constructor(props) {
		super(props);

		this.state = { qn: 0, toSelection: true };
		this.onNavigate = this.onNavigate.bind(this);
		this.toSelection = this.toSelection.bind(this);
		this.getQuestions = this.getQuestions.bind(this);
	}

	componentWillMount() {
		if (this.props.settings.questions.length > 0) {
			this.setState({ toSelection: false });
			this.getQuestions();
		}
	}

	onNavigate(q) {
		this.setState({
			qn: q - 1
		});
	}

	toSelection() {
		this.setState({ toSelection: true });
	}

	getQuestions() {
		let selection,
			type = this.props.settings.type;
		if (type === 'random') {
			// TODO: Bedre måde at udvælge random på:
			// Evt. ny prop: index, shuffle alle spørgsmål --> udvælg fra array[index] til array[index + antal]
			selection = _.sampleSize(
				this.props.settings.questions,
				this.props.settings.n
			);

			selection = _.map(selection, '_id');
		} else if (type === 'set') {
			selection = { ...this.props.settings };
		}

		this.props.getQuestions(this.props.settings.type, selection);
		this.setState({ qn: 0 });
	}

	render() {
		if (this.state.toSelection) return <Redirect to="/" />;
		if (!this.props.questions)
			return (
				<Dimmer active page>
					<Loader>Henter spørgsmål ...</Loader>
				</Dimmer>
			);
		return (
			<div className="App">
				<Container>
					<QuestionHeader
						qn={this.state.qn}
						qmax={this.props.questions.length}
					/>
					<Question qn={this.state.qn} />
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
					<Button
						content="Vend tilbage til oversigten"
						color="red"
						onClick={this.toSelection}
					/>
					<Button
						content="Få nye spørgsmål (samme indstillinger)"
						color="yellow"
						onClick={this.getQuestions}
					/>
				</Container>
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
