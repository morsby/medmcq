import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../actions';
import _ from 'lodash';
import marked from 'marked';

import { Table, Button, Divider } from 'semantic-ui-react';

const ProfileAnswerDetails = props => {
	let { answeredQuestions, summary } = props.performance;

	if (props.filter) {
		answeredQuestions = _.filter(answeredQuestions, q => {
			return summary[props.filter].indexOf(q._id) !== -1;
		});
	}

	let startQuiz = () => {
		let ids;
		if (!props.filter) {
			ids = [...summary.allRight, ...summary.allWrong, ...summary.mixed];
		} else {
			ids = summary[props.filter];
		}

		props.getQuestions('random', ids);
		props.history.push('/quiz');
	};

	let total = Object.keys(answeredQuestions).length;
	return (
		<div>
			<Divider hidden />
			{total > 0 && (
				<Button onClick={startQuiz}>
					Start en quiz med nedenstående {total > 1 ? 'alle' : ''}{' '}
					{total} spørgsmål
				</Button>
			)}
			<Table sortable celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Spørgsmål</Table.HeaderCell>
						<Table.HeaderCell>Speciale</Table.HeaderCell>
						<Table.HeaderCell>Sæt</Table.HeaderCell>
						<Table.HeaderCell textAlign="right">
							Din svarprocent
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{_.map(answeredQuestions, q => {
						return (
							<Table.Row
								warning={summary.mixed.indexOf(q._id) !== -1}
								positive={
									summary.allRight.indexOf(q._id) !== -1
								}
								negative={
									summary.allWrong.indexOf(q._id) !== -1
								}
								key={q._id}
								verticalAlign="top"
							>
								<Table.Cell>
									<div
										dangerouslySetInnerHTML={{
											__html: marked(q.question)
										}}
									/>
								</Table.Cell>
								<Table.Cell collapsing>
									{q.specialty.join()}
								</Table.Cell>
								<Table.Cell collapsing>
									{q.examSeason}
									{q.examYear}
								</Table.Cell>
								<Table.Cell collapsing textAlign="right">
									{Math.round(
										(q.userAnswers.correct /
											(q.userAnswers.correct +
												q.userAnswers.wrong)) *
											100,
										2
									)}%
								</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table>
		</div>
	);
};

export default withRouter(
	connect(
		null,
		actions
	)(ProfileAnswerDetails)
);
