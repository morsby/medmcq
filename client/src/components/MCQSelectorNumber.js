import React from 'react';
import { Form, Radio, Divider, Header } from 'semantic-ui-react';

const MCQSelectorNumber = props => {
	return (
		<Form inline>
			<Header as="h3">Hvor mange spørgsmål vil du have?</Header>
			<Form.Group>
				<Form.Field width={1}>
					<Radio
						label="5"
						value={5}
						name="n"
						checked={props.n === 5}
						onChange={props.onNChange}
					/>
					<Divider vertical hidden />
				</Form.Field>

				<Form.Field width={1}>
					<Radio
						label="10"
						value={10}
						name="n"
						checked={props.n === 10}
						onChange={props.onNChange}
						width={1}
					/>
				</Form.Field>
				<Form.Field width={1}>
					<Radio
						label="20"
						value={20}
						name="n"
						checked={props.n === 20}
						onChange={props.onNChange}
						width={3}
					/>
				</Form.Field>
				<Form.Field width={1}>
					<Radio
						label="40"
						value={40}
						name="n"
						checked={props.n === 40}
						onChange={props.onNChange}
					/>
				</Form.Field>
				<Form.Field width={1}>
					<Radio
						label="80"
						value={80}
						name="n"
						checked={props.n === 80}
						onChange={props.onNChange}
					/>
				</Form.Field>
			</Form.Group>
		</Form>
	);
};

export default MCQSelectorNumber;
