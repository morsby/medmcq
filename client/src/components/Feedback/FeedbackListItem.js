import React from 'react';
import PropTypes from 'prop-types';

import { Card, Button, Icon, Label } from 'semantic-ui-react';

const FeedbackListItem = ({ feedback, handleClick }) => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header as="a" onClick={() => handleClick(feedback._id)}>
                    {feedback.title}
                </Card.Header>
                <Card.Meta>
                    {new Date(feedback.date).toLocaleString('da-DK')}
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Button as="div" labelPosition="right">
                    <Button color="red">
                        <Icon name="heart" />
                    </Button>
                    <Label as="a" basic color="red" pointing="left">
                        {feedback.votes}
                    </Label>
                </Button>
            </Card.Content>
        </Card>
    );
};

FeedbackListItem.propTypes = {
    feedback: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
};

export default FeedbackListItem;
