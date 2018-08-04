import React from 'react';

import { Card, Button, Icon, Label } from 'semantic-ui-react';

const FeedbackListItem = props => {
	return (
		<Card fluid>
			<Card.Content>
				<Card.Header
					as="a"
					onClick={() => props.handleClick(props.feedback._id)}
				>
					{props.feedback.title}
				</Card.Header>
				<Card.Meta>
					{new Date(props.feedback.date).toLocaleString('da-DK')}
				</Card.Meta>
			</Card.Content>
			<Card.Content extra>
				<Button as="div" labelPosition="right">
					<Button color="red">
						<Icon name="heart" />
					</Button>
					<Label as="a" basic color="red" pointing="left">
						{props.feedback.votes}
					</Label>
				</Button>
			</Card.Content>
		</Card>
	);
};

export default FeedbackListItem;
