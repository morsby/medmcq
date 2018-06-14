import React from 'react';

import { Card, List, Container } from 'semantic-ui-react';

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
					{Math.round((correct / props.answers.length) * 10000) / 100}%
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

	let questionLinkText = question => {
		let text;
		if (question.length > 33) {
			text = question.substring(0, 30) + ' ...';
		} else {
			text = question;
		}

		return text;
	};

	return (
		<Container>
			<Card fluid>
				<Card.Content>
					<Card.Header>Fremgang</Card.Header>
					{stats}
					<Card.Description style={{ columns: '250px 4' }}>
						<List ordered>
							{progress.map(res => {
								let svar;
								if (res.svar === 'Korrekt')
									svar = 'svar-korrekt';
								if (res.svar === 'Forkert')
									svar = 'svar-forkert';
								return (
									<List.Item
										as="a"
										className={svar}
										onClick={() =>
											props.clickHandler(res.n)
										}
										key={res.n}
									>
										{questionLinkText(
											props.questions[res.n].question
										)}
									</List.Item>
								);
							})}
						</List>
					</Card.Description>
				</Card.Content>
			</Card>
		</Container>
	);
};

export default Summary;
