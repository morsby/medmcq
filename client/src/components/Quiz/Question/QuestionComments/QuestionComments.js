import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button, Message } from 'semantic-ui-react';

import QuestionCommentSingle from './QuestionCommentSingle';

/**
 * Viser kommentarer til et spørgsmål
 * Modtager alle props fra ../Question.js
 * @param {array} comments          Array af kommentarer til spørgsmålet
 * @param {string} newComment       Den nye kommentar
 * @param {func}  onCommentType     Funktion til at ændre kommentar-tekst
 * @param {func} onCommentPost      Funktion der poster kommentar
 * @param {func} onDeleteComment    Funktion der sletter kommentar
 * @param {func} onEditComment      Funktion til at åbne ændring af kommentar
 * @param {string} editingComment   id til ændret kommentar. false hvis ny kommentar
 * @param {func} undoEditComment           Funktion der fortryder ændring / starter ny kommentar
 * @param {object} user             Brugeren
 */
const QuestionComments = ({
    comments,
    newComment,
    onCommentType,
    onCommentPost,
    onDeleteComment,
    onEditComment,
    editingComment,
    undoEditComment,
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
                        onChange={onCommentType}
                        value={newComment}
                    />
                    <Message info>
                        At skrive en kommentar vil vise dit brugernavn
                        offentligt.
                    </Message>
                    <Button
                        onClick={onCommentPost}
                        disabled={newComment.length < 3}
                        style={{ margin: '0.5em 1em 0.5em 0' }}
                    >
                        Kommentér
                    </Button>
                    {editingComment && (
                        <Button negative onClick={undoEditComment}>
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
                    <QuestionCommentSingle
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

QuestionComments.propTypes = {
    comments: PropTypes.array,
    newComment: PropTypes.string,
    onCommentType: PropTypes.func,
    onCommentPost: PropTypes.func,
    onDeleteComment: PropTypes.func,
    onEditComment: PropTypes.func,
    editingComment: PropTypes.string,
    undoEditComment: PropTypes.func,
    user: PropTypes.object,
};

export default QuestionComments;
