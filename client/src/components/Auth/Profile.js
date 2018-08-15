import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import _ from 'lodash';

import { Container, Tab, List, Button, Divider } from 'semantic-ui-react';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';

import ProfileAnswerDetails from './ProfileAnswerDetails';

// TODO: Auth kræves
// TODO: Måde at få information om spørgsmål på

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = { details: false, results: {} };
	}
	componentWillMount() {
		this.props.fetchUser();
	}

	generateList = (semester, user) => {
		let answeredQuestions = _.get(
				user,
				['answeredQuestions', semester],
				{}
			),
			results = this.analyseQuestions(answeredQuestions);

		return (
			<div>
				<p>
					<strong>
						Du har svaret på {Object.keys(answeredQuestions).length}{' '}
						forskellige spørgsmål
					</strong>
				</p>
				<div>
					<p>Af dem har du svaret</p>
					<List bulleted className="analysis">
						<List.Item>
							<span>rigtigt</span> <em>hver</em> gang på{' '}
							{results.allCorrect.length} spørgsmål
						</List.Item>
						<List.Item>
							<span>forkert</span> <em>hver</em> gang på{' '}
							{results.allWrong.length} spørgsmål
						</List.Item>
						<List.Item>
							<span>både</span> rigtigt <em>og</em> forkert på{' '}
							{results.mixed.length} spørgsmål
						</List.Item>
					</List>
				</div>
				<Divider hidden />
				<Button
					onClick={() => this.getAnalysis(answeredQuestions)}
					disabled={Object.keys(answeredQuestions).length === 0}
				>
					Vis detaljer
				</Button>
			</div>
		);
	};

	analyseQuestions = questions => {
		let results = {
			allCorrect: [],
			allWrong: [],
			mixed: []
		};

		let questionIds = Object.keys(questions);

		let analyseQuestion = question => {
			if (question.wrong === 0 && question.correct > 0) {
				return 'allCorrect';
			}
			if (question.wrong > 0 && question.correct === 0) {
				return 'allWrong';
			}
			if (question.wrong > 0 && question.correct > 0) {
				return 'mixed';
			}
		};

		questionIds.map(id => {
			let res = analyseQuestion(questions[id]);

			if (res === 'allCorrect') results.allCorrect.push(id);
			if (res === 'allWrong') results.allWrong.push(id);
			if (res === 'mixed') results.mixed.push(id);
		});

		return results;
	};

	getAnalysis = questions => {
		let ids = Object.keys(questions);
		if (ids.length > 0) this.props.getAnsweredQuestions(ids);
		this.setState({ details: true });
	};

	render() {
		const { user, analysedQuestions } = this.props.auth,
			semestre = [7, 8, 9, 11];
		let panes = [];
		semestre.map(e =>
			panes.push({
				menuItem: `${e}. semester`,
				render: () => <Tab.Pane>{this.generateList(e, user)}</Tab.Pane>
			})
		);

		return (
			<div className="flex-container">
				<Header />
				<Container className="content">
					<h2>{user.username}</h2>
					<p>
						Herunder kan du se, hvordan du har klaret dig for hvert
						semester
					</p>
					<Tab panes={panes} />
					{this.state.details && (
						<ProfileAnswerDetails
							questions={analysedQuestions}
							analysis={this.analyseQuestions(analysedQuestions)}
						/>
					)}
				</Container>
				<Footer />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		settings: state.settings
	};
}

export default connect(
	mapStateToProps,
	actions
)(Profile);
