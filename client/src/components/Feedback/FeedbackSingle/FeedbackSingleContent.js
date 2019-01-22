import React from 'react';
import PropTypes from 'prop-types';

import marked from 'marked';
import { Card, Button, Icon, Label } from 'semantic-ui-react';

const FeedbackSingleContent = ({ feedback, votedFor, handleVote }) => {
    let votedUp = votedFor && votedFor.val === 1,
        votedDown = votedFor && votedFor.val === -1;

    return (
        <Card fluid>
            <Card.Content>
                <Card.Meta>
                    {new Date(feedback.date).toLocaleString('da-DK')}
                </Card.Meta>
                <Card.Header>{feedback.title}</Card.Header>
                <p
                    dangerouslySetInnerHTML={{
                        __html: marked(feedback.text),
                    }}
                />
            </Card.Content>
            {feedback._id && (
                <Card.Content extra>
                    <Button as="div" labelPosition="right">
                        <Button color="red">
                            <Icon name="heart" />
                        </Button>
                        <Label as="a" basic color="red" pointing="left">
                            {feedback.votes}
                        </Label>
                    </Button>

                    <Button
                        basic
                        positive
                        onClick={() => {
                            handleVote(1);
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
                            handleVote(-1);
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

FeedbackSingleContent.propTypes = {
    feedback: PropTypes.object.isRequired,
    votedFor: PropTypes.object,
    handleVote: PropTypes.func.isRequired,
};

export default FeedbackSingleContent;
