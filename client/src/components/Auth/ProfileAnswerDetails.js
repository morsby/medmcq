import React from 'react';

import { Table } from 'semantic-ui-react';

const ProfileAnswerDetails = props => {
	console.log(props.analysis);
	return (
		<Table sortable celled fixed>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Spørgsmål</Table.HeaderCell>
					<Table.HeaderCell>Speciale</Table.HeaderCell>
					<Table.HeaderCell>Sæt</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{props.questions.map(q => {
					return (
						<Table.Row>
							<Table.Cell>{q.question}</Table.Cell>
							<Table.Cell>{q.specialty}</Table.Cell>
							<Table.Cell>
								{q.examSeason}
								{q.examYear}
							</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table>
	);
};

export default ProfileAnswerDetails;
