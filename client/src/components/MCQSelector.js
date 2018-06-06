import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import _ from 'lodash';
import {
	Container,
	Header,
	Dropdown,
	Divider,
	Button
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import MCQSelectorNumber from './MCQSelectorNumber';
import MCQSelectorSets from './MCQSelectorSets';

import { semestre } from '../common';

class MCQSelector extends Component {
	constructor(props) {
		super(props);

		this.state = { submitted: false, err: [] };

		this.onSettingsChange = this.onSettingsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	onSettingsChange(e, { name, value }, prevSettings) {
		this.props.changeSettings({ [name]: value }, this.props.settings);
	}

	handleSubmit() {
		let err = [];
		if (!this.props.settings.semester) {
			err.push('Du skal vælge et semester først!');
		}
		if (this.props.settings.type === 'set' && !this.props.settings.set) {
			err.push('Du skal vælge et sæt for at kunne starte!');
		}

		if (err.length === 0) {
			this.setState({ submitted: true });
		} else {
			this.setState({ err });
		}
	}

	render() {
		if (this.state.submitted) {
			return <Redirect to="/mcq" />;
		}

		let fordeling = _.groupBy(this.props.settings.questions, 'specialty');
		// TODO: Få fordeling til at acceptere spørgsmål med flere specialer
		return (
			<Container>
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
						value="set"
						active={this.props.settings.type === 'set'}
						onClick={this.onSettingsChange}
					>
						Fulde eksamenssæt
					</Button>
					<Button
						name="type"
						value="specialer"
						active={this.props.settings.type === 'specialer'}
						onClick={this.onSettingsChange}
					>
						Specialer
					</Button>
				</Button.Group>
				<Divider hidden />
				{this.props.settings.type !== 'set' && (
					<MCQSelectorNumber
						n={this.props.settings.n}
						onNChange={this.onSettingsChange}
					/>
				)}
				{this.props.settings.type === 'set' && (
					<MCQSelectorSets
						settings={this.props.settings}
						onChange={this.onSettingsChange}
					/>
				)}

				<Divider hidden />
				{this.props.settings.semester && (
					<div>
						Der er {this.props.settings.questions.length} spørgsmål
						for det valgte semester.
					</div>
				)}
				<Divider hidden />
				{this.state.err.map(err => {
					return <h5>{err}</h5>;
				})}
				{this.props.settings.type !== 'specialer' && (
					<Button onClick={this.handleSubmit}>Start!</Button>
				)}
				{this.props.settings.type === 'specialer' && (
					<h1>Denne funktion virker desværre ikke endnu ...</h1>
				)}
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return { settings: state.settings };
}

export default connect(mapStateToProps, actions)(MCQSelector);
