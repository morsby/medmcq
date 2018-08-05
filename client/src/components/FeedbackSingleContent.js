import React from 'react';
import marked from 'marked';
import { Card, Button, Icon, Label } from 'semantic-ui-react';

const FeedbackSingleContent = props => {
	let votedUp = props.votedFor && props.votedFor.val === 1,
		votedDown = props.votedFor && props.votedFor.val === -1;

	return (
		<Card fluid>
			<Card.Content>
				<Card.Meta>
					{new Date(props.date).toLocaleString('da-DK')}
				</Card.Meta>
				<Card.Header>{props.title}</Card.Header>
				<p
					dangerouslySetInnerHTML={{
						__html: marked(props.text)
					}}
				/>
			</Card.Content>
			{props.id && (
				<Card.Content extra>
					<Button as="div" labelPosition="right">
						<Button color="red">
							<Icon name="heart" />
						</Button>
						<Label as="a" basic color="red" pointing="left">
							{props.votes}
						</Label>
					</Button>

					<Button
						basic
						positive
						onClick={() => {
							props.handleVote(1);
						}}
						disabled={votedDown}
					>
						<span role="img" aria-label="thumbs up">
							👍
						</span>
					</Button>
					<Button
						basic
						negative
						onClick={() => {
							props.handleVote(-1);
						}}
						disabled={votedUp}
					>
						<span role="img" aria-label="thumbs down">
							👎
						</span>
					</Button>
				</Card.Content>
			)}
		</Card>
	);
};

export default FeedbackSingleContent;
