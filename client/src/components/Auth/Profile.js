import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions';
import { urls } from '../../common';
import _ from 'lodash';

import { Container, Tab, List, Button, Divider } from 'semantic-ui-react';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';

import ProfileAnswerDetails from './ProfileAnswerDetails';

class Profile extends Component {
	constructor(props) {
		super(props);
		let { semester } = props.settings;
		const getIndex = semester => {
			switch (semester) {
				case 7:
					return 0;
				case 8:
					return 1;
				case 9:
					return 2;
				case 11:
					return 3;
				default:
					return 0;
			}
		};

		this.state = {
			activeTab: getIndex(semester),
			details: true,
			hidden: null
		};
	}

	getQuestions = semester => {
		let answeredQuestions = _.get(
			this.props,
			['auth', 'user', 'answeredQuestions', semester],
			{}
		);

		this.props.getAnsweredQuestions(answeredQuestions);
	};

	handleTabChange = (e, { activeIndex }) => {
		let semester = () => {
			switch (activeIndex) {
				case 0:
					return 7;
				case 1:
					return 8;
				case 2:
					return 9;
				case 3:
					return 11;
				default:
					return 7;
			}
		};
		this.getQuestions(semester());
		this.setState({ activeTab: activeIndex });
	};

	toggleDetails = () => {
		this.setState({ details: !this.state.details });
	};

	handleNavigation = path => {
		this.props.history.push(urls[path]);
	};

	generateTabContent = performance => {
		let totalAnswers = Object.keys(performance.answeredQuestions).length,
			{ allRight, allWrong, mixed } = performance.summary;
		return (
			<div>
				<p>
					<strong>
						Du har svaret på {totalAnswers} forskellige spørgsmål
					</strong>
				</p>
				<div>
					<p>Af dem har du svaret</p>
					<List bulleted className="analysis">
						<List.Item>
							<span>rigtigt</span> <em>hver</em> gang på{' '}
							{allRight.length} spørgsmål
						</List.Item>
						<List.Item>
							<span>forkert</span> <em>hver</em> gang på{' '}
							{allWrong.length} spørgsmål
						</List.Item>
						<List.Item>
							<span>både</span> rigtigt <em>og</em> forkert på{' '}
							{mixed.length} spørgsmål
						</List.Item>
					</List>
				</div>
				<Divider hidden />
				<Button
					onClick={this.toggleDetails}
					disabled={totalAnswers === 0}
				>
					{this.state.details ? 'Skjul' : 'Vis'} detaljer
				</Button>
			</div>
		);
	};

	render() {
		const { performance, user } = this.props.auth,
			semestre = [7, 8, 9, 11];
		let panes = [];
		semestre.map(e =>
			panes.push({
				menuItem: `${e}. semester`,
				render: () => (
					<Tab.Pane>{this.generateTabContent(performance)}</Tab.Pane>
				)
			})
		);

		return (
			<div className="flex-container">
				<Header />
				<Container className="content">
					<h2>{user.username}</h2>
					<Button
						basic
						color="yellow"
						onClick={() => this.handleNavigation('editProfile')}
					>
						Rediger profil
					</Button>
					<Button
						floated="right"
						negative
						onClick={() =>
							(window.location.href =
								urls.base + '/api/auth/logout')
						}
					>
						Log ud
					</Button>
					<Divider hidden />
					<p>
						Herunder kan du se, hvordan du har klaret dig for hvert
						semester
					</p>
					<Tab
						panes={panes}
						activeIndex={this.state.activeTab}
						onTabChange={this.handleTabChange}
					/>
					{this.state.details && (
						<ProfileAnswerDetails
							performance={performance}
							filter={this.state.filter}
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
