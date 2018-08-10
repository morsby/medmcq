import React from 'react';

import { Button, Divider } from 'semantic-ui-react';

const QuestionAnswerButtons = props => {
	const evalAnswer = answer => {
		if (!props.question.answer) return; // hvis ikke svaret
		if (answer === props.question.correctAnswer) return 'green'; // hvis korrekt svar
		if (answer === props.question.answer) return 'red'; // hvis forkert svar
		return 'grey'; // ikke valgt mulighed
	};

	let pristine = props.pristine ? 'pristine' : '';
	return (
		<Button.Group vertical fluid className={pristine}>
			<Button
				style={{ textAlign: 'left' }}
				onClick={() => props.onAnswer(1)}
				color={evalAnswer(1)}
				size="large"
			>
				A. {props.question.answer1}
			</Button>
			<Divider hidden />
			<Button
				style={{ textAlign: 'left' }}
				onClick={() => props.onAnswer(2)}
				color={evalAnswer(2)}
				size="large"
			>
				B. {props.question.answer2}
			</Button>
			<Divider hidden />
			<Button
				style={{ textAlign: 'left' }}
				onClick={() => props.onAnswer(3)}
				color={evalAnswer(3)}
				size="large"
			>
				C. {props.question.answer3}
			</Button>
		</Button.Group>
	);
};

export default QuestionAnswerButtons;
