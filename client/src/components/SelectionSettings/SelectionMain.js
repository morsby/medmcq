import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {
	Container,
	Header,
	Dropdown,
	Divider,
	Button
} from 'semantic-ui-react';

import SelectionHowMany from './SelectionHowMany';
import SelectionSets from './SelectionSets';
import SelectionSpecialties from './SelectionSpecialties';
import Footer from '../Misc/Footer';
import { default as UIHeader } from '../Misc/Header';

import { semestre, selectQuestions, urls } from '../../common';

class SelectionMain extends Component {
	constructor(props) {
		super(props);

		this.state = { submitted: false, err: [] };

		this.onSettingsChange = this.onSettingsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	onSettingsChange(e, { name, value }, prevSettings) {
		let newValue = value;
		if (name === 'specialer') {
			let currValues = this.props.settings.specialer,
				index = currValues.indexOf(value);
			newValue = currValues;

			if (index > -1) {
				newValue.splice(index, 1);
			} else {
				newValue.push(value);
			}
		}
		this.setState({ err: [] });
		this.props.changeSettings({ [name]: newValue }, this.props.settings);
	}

	handleSubmit(type) {
		let err = [];
		if (!this.props.settings.semester) {
			err.push('Du skal vælge et semester først!');
		}
		if (
			this.props.settings.type === 'specialer' &&
			this.props.settings.specialer.length === 0
		) {
			err.push('Du skal vælge mindst ét speciale.');
		}
		if (this.props.settings.type === 'set' && !this.props.settings.set) {
			err.push('Du skal vælge et sæt for at kunne starte!');
			if (this.props.settings.semester === 11) {
				err.push('You have to select a set to start.');
			}
		}

		if (this.props.settings.questions.length === 0) {
			err.push('Der er ingen spørgsmål for det valgte semester.');
			if (this.props.settings.semester === 11) {
				err.push('There are no questions for the selected semester.');
			}
		}

		if (err.length === 0) {
			this.setState({ submitted: true });
			if (type === 'new') {
				this.props.getQuestions(
					this.props.settings.type,
					selectQuestions(this.props.settings)
				);
			}
			this.props.history.push(urls.quiz);
		} else {
			this.setState({ err });
		}
	}

	render() {
		return (
			<div className="flex-container">
				<UIHeader />
				<Container className="content">
					<Header as="h1">
						MCQ'er fra kandidaten på medicin ved Aarhus Universitet
					</Header>
					<Header as="h3">Indtast dine valg nedenfor</Header>
					<Dropdown
						placeholder="Vælg semester"
						fluid
						selection
						options={semestre}
						name="semester"
						value={this.props.settings.semester}
						onChange={this.onSettingsChange}
					/>
					<Divider hidden />
					<Button.Group fluid widths={3}>
						<Button
							name="type"
							value="random"
							active={this.props.settings.type === 'random'}
							onClick={this.onSettingsChange}
						>
							Tilfældige spørgsmål
						</Button>

						<Button
							name="type"
							value="specialer"
							active={this.props.settings.type === 'specialer'}
							onClick={this.onSettingsChange}
						>
							Specialer
						</Button>
						<Button
							name="type"
							value="set"
							active={this.props.settings.type === 'set'}
							onClick={this.onSettingsChange}
						>
							Fulde eksamenssæt
						</Button>
					</Button.Group>

					<Divider hidden />
					{this.props.settings.type !== 'set' && (
						<SelectionHowMany
							n={this.props.settings.n}
							onNChange={this.onSettingsChange}
							total={this.props.settings.questions.length}
						/>
					)}
					{this.props.settings.type === 'set' && (
						<SelectionSets
							settings={this.props.settings}
							onChange={this.onSettingsChange}
						/>
					)}
					{this.props.settings.type === 'specialer' && (
						<SelectionSpecialties
							settings={this.props.settings}
							onChange={this.onSettingsChange}
						/>
					)}
					<Divider hidden />
					{this.state.err.map(err => {
						return <h5>{err}</h5>;
					})}
					<Button onClick={() => this.handleSubmit('new')}>
						Start!
					</Button>
					{this.props.answers.length > 0 && (
						<Button onClick={() => this.handleSubmit('cont')}>
							Fortsæt med igangværende spørgsmål
						</Button>
					)}
				</Container>
				<Footer />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		settings: state.settings,
		answers: state.answers,
		auth: state.auth
	};
}

export default connect(
	mapStateToProps,
	actions
)(SelectionMain);
