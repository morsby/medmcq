import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { Button, Card, Divider } from 'semantic-ui-react';

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
		const evalAnswer = answer => {
			if (!this.props.questions[this.props.qn].answer) return; // hvis ikke svaret
			if (answer === this.props.questions[this.props.qn].correctAnswer)
				return 'green disabled'; // hvis korrekt svar
			if (answer === this.props.questions[this.props.qn].answer)
				return 'red disabled'; // hvis forkert svar
			return 'grey disabled'; // ikke valgt mulighed
		};

		return (
			<Card fluid>
				<Card.Content>
					<Card.Header>
						{this.props.questions[this.props.qn].question}
					</Card.Header>

					<Card.Description>
						<Button.Group vertical>
							<Button
								style={{ textAlign: 'left' }}
								onClick={() => this.onAnswer(1)}
								color={evalAnswer(1)}
							>
								A. {this.props.questions[this.props.qn].answer1}
							</Button>
							<Divider />
							<Button
								style={{ textAlign: 'left' }}
								onClick={() => this.onAnswer(2)}
								color={evalAnswer(2)}
							>
								B. {this.props.questions[this.props.qn].answer2}
							</Button>
							<Divider />
							<Button
								style={{ textAlign: 'left' }}
								onClick={() => this.onAnswer(3)}
								color={evalAnswer(3)}
							>
								C. {this.props.questions[this.props.qn].answer3}
							</Button>
						</Button.Group>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className="date">
						Sæt: {this.props.questions[this.props.qn].examSeason}
						{this.props.questions[this.props.qn].examYear}
					</div>
					<div className="">
						Speciale:{' '}
						{this.props.questions[this.props.qn].specialty}
					</div>
				</Card.Content>
			</Card>
		);
	}
}

function mapStateToProps(state) {
	return { questions: state.questions };
}

export default connect(mapStateToProps, actions)(Question);
