import React from "react";
import marked from "marked";
import { Form, TextArea, Button, Comment, Message } from "semantic-ui-react";

const QuestionComment = ({ comment, user, deleteComment, editComment }) => {
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
                {comment.user === user.username && (
                    <>
                        <span onClick={() => deleteComment(comment._id)}>
                            Slet!
                        </span>
                        <span onClick={() => editComment(comment)}>Ret!</span>
                    </>
                )}
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
    onDeleteComment,
    onEditComment,
    editingComment,
    undoEdit,
    user
}) => {
    let form;
    if (user) {
        let skrivRet = editingComment ? "Ret" : "Skriv";
        form = (
            <div style={{ marginTop: "1em" }}>
                <h5>{skrivRet} en kommentar</h5>

                <Form>
                    <TextArea
                        name="comment"
                        placeholder="Skriv en kommentar"
                        onChange={onCommentWrite}
                        value={value}
                    />
                    <Message info>
                        At skrive en kommentar vil vise dit brugernavn
                        offentligt.
                    </Message>
                    <Button
                        onClick={onCommentPost}
                        disabled={value.length < 3}
                        style={{ margin: "0.5em 0" }}
                    >
                        Kommentér
                    </Button>
                    {editingComment && <Button onClick={undoEdit}>X</Button>}
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
                    <QuestionComment
                        key={c._id}
                        comment={c}
                        user={user}
                        deleteComment={onDeleteComment}
                        editComment={onEditComment}
                    />
                ))}
            </div>
            {form}
        </div>
    );
};
