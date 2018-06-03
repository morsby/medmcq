import React from 'react';

import { Card, List } from 'semantic-ui-react';

const Summary = props => {
	let stats = '';
	if (props.questions.length === props.answers.length) {
		let count = 0,
			correct = 0,
			i = props.answers.length;

		while (i--) {
			if (typeof props.answers[i] === 'undefined') {
				count++;
			} else if (props.answers[i] === true) {
				correct++;
			}
		}
		if (count === 0) {
			stats = (
				<Card.Content>
					Du svarede rigtigt på {correct} af {props.answers.length}{' '}
					spørgsmål. Det svarer til{' '}
					{Math.round(correct / props.answers.length * 10000) / 100}%
				</Card.Content>
			);
		}
	}

	let progress = [],
		n = props.questions.length;
	while (n--) {
		let svar;
		if (props.answers[n] === true) {
			svar = 'Korrekt';
		} else if (props.answers[n] === false) {
			svar = 'Forkert';
		} else if (typeof props.answers[n] === 'undefined') {
			svar = 'Ikke besvaret ...';
		}
		progress[n] = { n, svar };
	}
	console.log(progress);
	return (
		<Card fluid>
			<Card.Content>
				<Card.Header>Fremgang</Card.Header>
				{stats}
				<Card.Description>
					<List ordered>
						{progress.map(res => {
							let color;
							if (res.svar === 'Korrekt') color = 'green';
							if (res.svar === 'Forkert') color = 'red';
							return (
								<List.Item
									as="a"
									style={{ color }}
									onClick={() =>
										props.clickHandler(res.n + 1)
									}
								>
									{props.questions[res.n].question.substring(
										0,
										30
									)}
								</List.Item>
							);
						})}
					</List>
				</Card.Description>
			</Card.Content>
		</Card>
	);
};

export default Summary;
