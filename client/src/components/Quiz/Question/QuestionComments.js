import React from 'react';
import marked from 'marked';
import {
    Form,
    TextArea,
    Button,
    Comment,
    Message,
    Icon,
    Menu,
} from 'semantic-ui-react';

const SingleComment = ({ comment, user, deleteComment, editComment }) => {
    return (
        <Comment
            key={comment._id}
            style={{
                border: '1px solid rgb(140,140,140)',
                borderRadius: '5px',
                marginTop: '1em',
                padding: '0.5em',
                paddingTop: 0,
            }}
        >
            <Comment.Content>
                <Comment.Author as="strong">{comment.user}</Comment.Author>
                <Comment.Metadata style={{ color: 'rgb(140, 140, 140)' }}>
                    {new Date(comment.date).toLocaleString('da-DK')}
                </Comment.Metadata>

                <Comment.Text
                    style={{ marginTop: '1em', fontSize: '18px' }}
                    dangerouslySetInnerHTML={{
                        __html: marked(comment.comment),
                    }}
                />
                {comment.user === user.username && (
                    <Menu size="mini" icon="labeled" secondary>
                        <Menu.Item
                            onClick={() => deleteComment(comment._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Icon name="trash" color="red" />
                            Slet!
                        </Menu.Item>
                        <Menu.Item
                            style={{ cursor: 'pointer' }}
                            onClick={() => editComment(comment)}
                        >
                            <Icon name="edit" color="yellow" />
                            Ret!
                        </Menu.Item>
                    </Menu>
                )}
            </Comment.Content>
        </Comment>
    );
};

const QuestionComments = ({
    comments,
    value,
    onCommentWrite,
    onCommentPost,
    onDeleteComment,
    onEditComment,
    editingComment,
    undoEdit,
    user,
}) => {
    let form;
    if (user) {
        let skrivRet = editingComment ? 'Ret' : 'Skriv';
        form = (
            <div style={{ marginTop: '1em' }}>
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
                        style={{ margin: '0.5em 1em 0.5em 0' }}
                    >
                        Kommentér
                    </Button>
                    {editingComment && (
                        <Button negative onClick={undoEdit}>
                            Fortryd ændring
                        </Button>
                    )}
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
                    <SingleComment
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

export default QuestionComments;
