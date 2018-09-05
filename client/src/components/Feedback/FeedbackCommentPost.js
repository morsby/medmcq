import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";

import { Button } from "semantic-ui-react";
import { Form, Field } from "react-final-form";

const FeedbackCommentPost = ({
    feedbackId,
    replyId,
    replySlug,
    replyReset,
    postFeedbackComment // fra actions connect
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
            <Form
                onSubmit={handleSubmit}
                validate={values => {
                    const errors = {};

                    if (!values.text || values.text.length < 10) {
                        errors.text = "Teksten skal minimum være 10 tegn";
                    }
                    return errors;
                }}
                render={({
                    handleSubmit,
                    submitting,
                    pristine,
                    values,
                    form,
                    invalid
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
                                        "field " +
                                        (meta.error && meta.touched
                                            ? "error"
                                            : "")
                                    }
                                >
                                    <label>Kommentar</label>
                                    {replyId && (
                                        <p>
                                            Du er ved at svare på kommentaren
                                            med id: {replySlug}. Skriv i stedet
                                            en{" "}
                                            <a
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => replyReset()}
                                            >
                                                ny kommentar
                                            </a>.
                                        </p>
                                    )}
                                    <div className="ui info message mini form-explanation">
                                        <a
                                            href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Markdown-formattering
                                        </a>{" "}
                                        er undersøttet
                                    </div>
                                    <textarea
                                        {...input}
                                        placeholder="Forslag"
                                    />

                                    <div className="form-error">
                                        {meta.error &&
                                            meta.touched && (
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
                            Submit
                        </Button>
                    </form>
                )}
            />
        </div>
    );
};

FeedbackCommentPost.propTypes = {
    feedbackId: PropTypes.string.isRequired,
    replyId: PropTypes.string,
    replySlug: PropTypes.string,
    replyReset: PropTypes.func.isRequired
};

export default connect(
    null,
    actions
)(FeedbackCommentPost);
