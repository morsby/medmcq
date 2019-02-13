import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import { Button } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';
import { Translate } from 'react-localize-redux';

const FeedbackCommentPost = ({
    feedbackId,
    replyId,
    replySlug,
    replyReset,
    postFeedbackComment, // fra actions connect
}) => {
    const handleSubmit = formValues => {
        formValues.feedbackId = feedbackId;
        formValues.parent_id = replyId;

        return new Promise((resolve, reject) => {
            postFeedbackComment(formValues);
            replyReset();
            resolve();
        });
    };

    // TODO: Refactor: Flyt validation ud

    return (
        <div>
            <Translate>
                {({ translate }) => (
                    <Form
                        onSubmit={handleSubmit}
                        validate={values => {
                            const errors = {};

                            if (!values.text || values.text.length < 10) {
                                errors.text = translate(
                                    'feedbackPost.errs.text_too_short',
                                    { min: 10 }
                                );
                            }
                            return errors;
                        }}
                        render={({
                            handleSubmit,
                            submitting,
                            pristine,
                            form,
                            invalid,
                        }) => (
                            <form
                                onSubmit={event => {
                                    handleSubmit(event).then(form.reset());
                                }}
                                className="ui form"
                            >
                                <Field name="text">
                                    {({ input, meta }) => (
                                        <div
                                            className={
                                                'field ' +
                                                (meta.error && meta.touched
                                                    ? 'error'
                                                    : '')
                                            }
                                        >
                                            <label>
                                                {translate(
                                                    'feedbackCommentPost.write_comment'
                                                )}
                                            </label>
                                            {replyId && (
                                                <p>
                                                    <Translate
                                                        id="feedbackCommentPost.replying_to"
                                                        data={{ replySlug }}
                                                    />
                                                    <span
                                                        style={{
                                                            cursor: 'pointer',
                                                            color:
                                                                'rgb(87, 138, 251)',
                                                        }}
                                                        onClick={() =>
                                                            replyReset()
                                                        }
                                                    >
                                                        <Translate id="feedbackCommentPost.new_comment" />
                                                    </span>
                                                </p>
                                            )}
                                            <div className="ui info message mini form-explanation">
                                                {translate(
                                                    'feedbackPost.form_fields.markdown_supported'
                                                )}
                                            </div>
                                            <textarea
                                                {...input}
                                                placeholder={translate(
                                                    'feedbackCommentPost.write_comment'
                                                )}
                                            />

                                            <div className="form-error">
                                                {meta.error && meta.touched && (
                                                    <span>{meta.error}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Field>

                                <Button
                                    type="submit"
                                    disabled={submitting || pristine || invalid}
                                >
                                    {translate('feedbackCommentPost.submit')}
                                </Button>
                            </form>
                        )}
                    />
                )}
            </Translate>
        </div>
    );
};

FeedbackCommentPost.propTypes = {
    feedbackId: PropTypes.string.isRequired,
    replyId: PropTypes.string,
    replySlug: PropTypes.string,
    replyReset: PropTypes.func.isRequired,
    postFeedbackComment: PropTypes.func,
};

export default connect(
    null,
    actions
)(FeedbackCommentPost);
