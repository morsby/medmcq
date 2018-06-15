import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { semestre, specialer } from '../common';
import {
	Container,
	Button,
	Radio,
	Form,
	Dropdown,
	Header,
	Grid,
	List
} from 'semantic-ui-react';

const initialState = {
	question: '',
	answer1: '',
	answer2: '',
	answer3: '',
	correctAnswer: null,
	image: null,
	imageSrc: '',
	semester: null,
	examSeason: null,
	examYear: null
};

const resetState = {
	question: '',
	answer1: '',
	answer2: '',
	answer3: '',
	correctAnswer: null,
	image: null,
	imageSrc: ''
};

class AddQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;

		this.onChange = this.onChange.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.removeImage = this.removeImage.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	reset() {
		this.setState(resetState);
	}

	onChange(e, { name, value }) {
		this.setState({ [name]: value }, () => {
			if (
				this.state.semester &&
				this.state.examSeason &&
				this.state.examYear
			) {
				let type = 'set';
				let selection = {
					semester: this.state.semester,
					set: this.state.examYear + '/' + this.state.examSeason
				};
				this.props.getQuestions(type, selection);
			}
		});
	}

	onUpload(e) {
		this.setState({ image: e.target.files[0] });

		// Assuming only image
		var reader = new FileReader();

		reader.onloadend = function(e) {
			this.setState({
				imageSrc: [reader.result],
				imageWidth: '100%'
			});
		}.bind(this);
	}

	removeImage() {
		this.setState({ imageSrc: '', image: null, imageWidth: 0 });
	}

	handleClick(e) {
		this.refs.fileUploader.click();
	}

	handleSubmit() {
		//TODO: Validation
		this.props.postQuestion(this.state);

		this.reset();
	}

	render() {
		var years = [];
		for (var i = 2011; i <= new Date().getFullYear(); i++) {
			years.push({ text: i, value: i });
		}
		let exams = {
			years,
			season: [
				{ text: 'Forår', value: 'F' },
				{ text: 'Efterår', value: 'E' }
			]
		};

		let printQuestions = q => {
			return (
				<List.Item key={q._id}>{q.question.substr(0, 30)}...</List.Item>
			);
		};

		return (
			<Container>
				<Grid columns={2}>
					<Grid.Row>
						<Grid.Column width={4}>
							I sættet findes allerede{' '}
							{this.props.questions.length} spørgsmål:
							<List>
								{this.props.questions.map(q =>
									printQuestions(q)
								)}
							</List>
						</Grid.Column>
						<Grid.Column>
							<Form>
								<Form.Group widths="equal">
									<Form.Field>
										<label>Semester</label>
										<Dropdown
											value={this.state.semester}
											fluid
											selection
											options={semestre}
											name="semester"
											onChange={this.onChange}
										/>
									</Form.Field>
									<Form.Field>
										<label>År</label>
										<Dropdown
											fluid
											selection
											options={exams.years}
											name="examYear"
											onChange={this.onChange}
										/>
									</Form.Field>
									<Form.Field>
										<label>Semester (forår/efterår)</label>
										<Dropdown
											fluid
											selection
											options={exams.season}
											name="examSeason"
											onChange={this.onChange}
										/>
									</Form.Field>
								</Form.Group>
								<Form.Field>
									<label>Speciale(r): </label>
									<Dropdown
										search
										multiple
										selection
										options={specialer[this.state.semester]}
										name="specialty"
										onChange={this.onChange}
									/>
								</Form.Field>

								<Form.Field>
									<label>
										Spørgsmål (understøtter
										Markdown-formattering)
									</label>
									<Form.TextArea
										name="question"
										value={this.state.question}
										onChange={this.onChange}
									/>
								</Form.Field>
								<Form.Group>
									<Form.Field width={16}>
										<label>Svarmulighed 1</label>
										<Form.TextArea
											name="answer1"
											value={this.state.answer1}
											onChange={this.onChange}
										/>
									</Form.Field>
								</Form.Group>
								<Form.Field>
									<label>Svarmulighed 2</label>
									<Form.TextArea
										name="answer2"
										value={this.state.answer2}
										onChange={this.onChange}
									/>
								</Form.Field>
								<Form.Field>
									<label>Svarmulighed 3</label>
									<Form.TextArea
										name="answer3"
										value={this.state.answer3}
										onChange={this.onChange}
									/>
								</Form.Field>
								<Header as="h4">Rigtigt svar?</Header>
								<Form.Group widths="equal">
									<Form.Field>
										<Radio
											name="correctAnswer"
											value={1}
											label="1"
											checked={
												this.state.correctAnswer === 1
											}
											onChange={this.onChange}
										/>
									</Form.Field>
									<Form.Field>
										<label />
										<Radio
											name="correctAnswer"
											value={2}
											label="2"
											checked={
												this.state.correctAnswer === 2
											}
											onChange={this.onChange}
										/>
									</Form.Field>
									<Form.Field>
										<label> </label>
										<Radio
											name="correctAnswer"
											value={3}
											label="3"
											checked={
												this.state.correctAnswer === 3
											}
											onChange={this.onChange}
										/>
									</Form.Field>
								</Form.Group>
								<div>
									<div>
										<Button.Group fluid>
											<Button
												color="olive"
												onClick={this.handleClick}
											>
												Upload billede
											</Button>
											<Button
												color="teal"
												onClick={this.removeImage}
											>
												Fjern billede
											</Button>
										</Button.Group>
									</div>
									<input
										type="file"
										ref="fileUploader"
										name="image"
										style={{ display: 'none' }}
										onChange={this.onUpload}
									/>

									<img
										src={this.state.imageSrc}
										alt="Uploadet billede"
										width={this.state.imageWidth}
									/>
								</div>
								<div>
									<Button
										fluid
										onClick={this.handleSubmit}
										color="green"
									>
										Tilføj spørgsmål!
									</Button>
								</div>
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return {
		questions: state.questions
	};
}

export default connect(
	mapStateToProps,
	actions
)(AddQuestion);
