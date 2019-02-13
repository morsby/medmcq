import React from 'react';
import PropTypes from 'prop-types';

import marked from 'marked';
import { Comment, Icon, Menu } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
/**
 * Component der viser den enkelte kommentar
 * Props fra QuestionComments.js.
 * @param {object}  comment       Selve kommentaren.
 * @param {object}  user          Brugeren.
 * @param {func}    deleteComment Funktion at slette kommentar
 * @param {func}    editComment   Funktion at ændre kommentar
 */
const QuestionCommentSingle = ({
    comment,
    user,
    deleteComment,
    editComment,
}) => {
    if (!user) user = {};
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
                            <Translate id="questionCommentSingle.delete" />
                        </Menu.Item>
                        <Menu.Item
                            style={{ cursor: 'pointer' }}
                            onClick={() => editComment(comment)}
                        >
                            <Icon name="edit" color="yellow" />
                            <Translate id="questionCommentSingle.edit" />
                        </Menu.Item>
                    </Menu>
                )}
            </Comment.Content>
        </Comment>
    );
};

QuestionCommentSingle.propTypes = {
    comment: PropTypes.object,
    user: PropTypes.object,
    deleteComment: PropTypes.func,
    editComment: PropTypes.func,
};

export default QuestionCommentSingle;
