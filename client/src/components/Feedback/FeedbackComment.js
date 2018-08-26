import React from "react";
import PropTypes from "prop-types";

import { Card, Button } from "semantic-ui-react";
import marked from "marked";

const FeedbackComment = ({ comment, replyId, onReply }) => {
    let level = comment.slug.split("/").length - 1;
    let levels = [...Array(level).keys()];
    return (
        <Card className={`comment-level-${level}`} fluid>
            <Card.Content>
                <Card.Meta>
                    {new Date(comment.date).toLocaleString("da-DK")}
                </Card.Meta>
                <p
                    dangerouslySetInnerHTML={{
                        __html: marked(comment.text)
                    }}
                />

                <Card.Meta>
                    <Button
                        basic={replyId !== comment._id}
                        color="green"
                        className="click"
                        onClick={() => onReply(comment._id, comment.slug)}
                    >
                        SVAR
                    </Button>
                    <p>{comment.slug}</p>
                </Card.Meta>
            </Card.Content>
            {levels.map(i => <div className={`v${i}`} key={`line-${i}`} />)}
        </Card>
    );
};

FeedbackComment.propTypes = {
    comment: PropTypes.object.isRequired,
    replyId: PropTypes.string,
    onReply: PropTypes.func.isRequired
};

export default FeedbackComment;
