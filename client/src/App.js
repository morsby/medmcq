import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './actions';

import { Container, Dimmer, Loader } from 'semantic-ui-react';

import ThemingLayout from './components/Theme';
import Question from './components/Question';
import QuestionNavigator from './components/QuestionNavigator';
import QuestionHeader from './components/QuestionHeader';
import Summary from './components/Summary';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = { qn: 0, answer: false };
		this.onNavigate = this.onNavigate.bind(this);
	}

	componentWillMount() {
		this.props.fetchAllQuestions();
	}

	onNavigate(q) {
		this.setState({
			qn: q - 1
		});
	}

	render() {
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
				</Container>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { questions: state.questions, answers: state.answers };
}

export default connect(mapStateToProps, actions)(App);
