import React from 'react';
import { Form, Radio, Divider, Header } from 'semantic-ui-react';

const radioGenerator = (set, props) => {
	return (
		<Form.Group key={set.api}>
			<Form.Field>
				<Radio
					label={set.text}
					value={set.api}
					checked={set.api === props.settings.set}
					name="set"
					onChange={props.onChange}
				/>
				<Divider vertical hidden />
			</Form.Field>
		</Form.Group>
	);
};

const MCQSelectorSets = props => {
	if (!props.settings.semester)
		return (
			<Header as="h3">
				Vælg et semester for at se tilgængelige eksamenssæt
			</Header>
		);
	return (
		<Form>
			<Header as="h3">
				For {props.settings.semester}. semester er der følgende
				eksamenssæt at vælge mellem:
			</Header>

			{props.settings.sets.map(set => {
				return radioGenerator(set, props);
			})}
		</Form>
	);
};

export default MCQSelectorSets;
