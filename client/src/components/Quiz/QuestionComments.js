import React, { Component } from "react";
import marked from "marked";
import { Form, TextArea, Button, Comment, Message } from "semantic-ui-react";

const QuestionComment = ({ comment }) => {
    return (
        <Comment
            key={comment._id}
            style={{
                border: "1px solid rgb(140,140,140)",
                borderRadius: "5px",
                marginTop: "1em",
                padding: "0.5em",
                paddingTop: 0
            }}
        >
            <Comment.Content>
                <Comment.Author as="strong">{comment.user}</Comment.Author>
                <Comment.Metadata style={{ color: "rgb(140, 140, 140)" }}>
                    {new Date(comment.date).toLocaleString("da-DK")}
                </Comment.Metadata>
                <Comment.Text
                    style={{ marginTop: "1em" }}
                    dangerouslySetInnerHTML={{
                        __html: marked(comment.comment)
                    }}
                />
            </Comment.Content>
        </Comment>
    );
};

export default ({
    comments,
    value,
    onCommentWrite,
    onCommentPost,
    isLoggedIn
}) => {
    let form;
    if (isLoggedIn) {
        form = (
            <div style={{ marginTop: "1em" }}>
                <h5>Skriv en kommentar</h5>
                <Form>
                    <TextArea
                        name="comment"
                        placeholder="Skriv en kommentar"
                        onChange={onCommentWrite}
                        value={value}
                    />
                    <Button
                        onClick={onCommentPost}
                        disabled={value.length < 3}
                        style={{ margin: "0.5em 0" }}
                    >
                        Kommentér
                    </Button>
                </Form>
            </div>
        );
    } else {
        form = <Message warning>Log ind for at skrive en kommentar</Message>;
    }
    return (
        <div>
            <div>
                {comments.map(c => (
                    <QuestionComment comment={c} />
                ))}
            </div>
            {form}
        </div>
    );
};
