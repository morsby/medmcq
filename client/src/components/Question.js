import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import marked from 'marked';

import { imageURL } from '../common';

import {
	Container,
	Button,
	Grid,
	Divider,
	Dimmer,
	Loader,
	Image,
	Segment,
	List
} from 'semantic-ui-react';

class Question extends Component {
	onAnswer(answer) {
		// If not already answered:
		if (!this.props.questions[this.props.qn].answer) {
			// Call answerQuestion action with id (passed from parent) and answer
			this.props.answerQuestion(
				this.props.questions[this.props.qn]._id,
				answer,
				{
					qn: this.props.qn,
					correct:
						this.props.questions[this.props.qn].correctAnswer ===
						answer
				}
			);
		}
	}

	render() {
		let question = this.props.questions[this.props.qn];
		const evalAnswer = answer => {
			if (!question.answer) return; // hvis ikke svaret
			if (answer === question.correctAnswer) return 'green disabled'; // hvis korrekt svar
			if (answer === question.answer) return 'red disabled'; // hvis forkert svar
			return 'grey disabled'; // ikke valgt mulighed
		};

		if (!this.props.questions.length > 0)
			return (
				<Dimmer active page>
					<Loader>Henter spørgsmål ...</Loader>
				</Dimmer>
			);

		return (
			<Container
				style={{
					paddingTop: '112px'
				}}
			>
				<Segment>
					<Grid divided columns="equal">
						<Grid.Row>
							<Grid.Column>
								<div
									style={{ fontSize: '18px' }}
									dangerouslySetInnerHTML={{
										__html: marked(question.question)
									}}
								/>
								<Divider />
								<Button.Group vertical fluid>
									<Button
										style={{ textAlign: 'left' }}
										onClick={() => this.onAnswer(1)}
										color={evalAnswer(1)}
										size="large"
									>
										A. {question.answer1}
									</Button>
									<Divider hidden />
									<Button
										style={{ textAlign: 'left' }}
										onClick={() => this.onAnswer(2)}
										color={evalAnswer(2)}
										size="large"
									>
										B. {question.answer2}
									</Button>
									<Divider hidden />
									<Button
										style={{ textAlign: 'left' }}
										onClick={() => this.onAnswer(3)}
										color={evalAnswer(3)}
										size="large"
									>
										C. {question.answer3}
									</Button>
								</Button.Group>
							</Grid.Column>
							{question.image && (
								<Grid.Column>
									<Image src={imageURL(question.image_id)} />
								</Grid.Column>
							)}
						</Grid.Row>
					</Grid>
					<Divider />
					<List horizontal>
						<List.Item>
							<List.Header>Sæt: </List.Header>
						</List.Item>
						<List.Item>
							{question.examSeason}
							{question.examYear}
						</List.Item>
					</List>
					<br />
					<List horizontal>
						<List.Item>
							<List.Header>Speciale: </List.Header>
						</List.Item>

						{question.specialty.map(e => (
							<List.Item>{e}</List.Item>
						))}
					</List>
				</Segment>
				<Divider hidden />
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return { questions: state.questions };
}

export default connect(
	mapStateToProps,
	actions
)(Question);
