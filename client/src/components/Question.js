import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import marked from 'marked';

import {
	Button,
	Card,
	Divider,
	Dimmer,
	Loader,
	Image
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
			<Card fluid>
				<Card.Content>
					<Card.Header
						dangerouslySetInnerHTML={{
							__html: marked(question.question)
						}}
					/>

					<Card.Description>
						{question.image && <Image src={question.image} />}
						<Divider hidden />
						<Button.Group vertical>
							<Button
								style={{ textAlign: 'left' }}
								onClick={() => this.onAnswer(1)}
								color={evalAnswer(1)}
							>
								A. {question.answer1}
							</Button>
							<Divider />
							<Button
								style={{ textAlign: 'left' }}
								onClick={() => this.onAnswer(2)}
								color={evalAnswer(2)}
							>
								B. {question.answer2}
							</Button>
							<Divider />
							<Button
								style={{ textAlign: 'left' }}
								onClick={() => this.onAnswer(3)}
								color={evalAnswer(3)}
							>
								C. {question.answer3}
							</Button>
						</Button.Group>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className="date">
						Sæt: {question.examSeason}
						{question.examYear}
					</div>
					<div className="">Speciale: {question.specialty}</div>
				</Card.Content>
			</Card>
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
