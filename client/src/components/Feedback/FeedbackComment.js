import React from 'react';

import { Card, Button } from 'semantic-ui-react';
import marked from 'marked';

const FeedbackComment = props => {
	let level = props.comment.slug.split('/').length - 1;
	let levels = [...Array(level).keys()];
	return (
		<Card className={`comment-level-${level}`} fluid>
			<Card.Content>
				<Card.Meta>
					{new Date(props.comment.date).toLocaleString('da-DK')}
				</Card.Meta>
				<p
					dangerouslySetInnerHTML={{
						__html: marked(props.comment.text)
					}}
				/>

				<Card.Meta>
					<Button
						basic={props.replyId !== props.comment._id}
						color="green"
						onClick={() =>
							props.onReply(props.comment._id, props.comment.slug)
						}
					>
						SVAR
					</Button>
					<p>{props.comment.slug}</p>
				</Card.Meta>
			</Card.Content>
			{levels.map(i => <div className={`v${i}`} key={`line-${i}`} />)}
		</Card>
	);
};

export default FeedbackComment;
