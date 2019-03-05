import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { Container, Button } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';
import { Translate } from 'react-localize-redux';

import FeedbackNavigation from '../FeedbackNavigation';
// bruges til preview:
import FeedbackSingleContent from '../FeedbackSingle/FeedbackSingleContent';
import Footer from '../../Layout/Footer';

/**
 * Component der tillader post af ny feedback.
 * @param {func} postFeedback Funktion der poster feedback til API'en. Fra redux
 * @param {}     history      Fra react-router (fordi denne component kaldes fra src/index.js)
 */
const FeedbackPost = ({ postFeedback, history }) => {
    const handleSubmit = formValues => {
        postFeedback(formValues, id => {
            setTimeout(history.push('/feedback/' + id), 150);
        });
    };

    // TODO: Refactor: Flyt validation ud

    return (
        <div className="flex-container">
            <Container className="content">
                <FeedbackNavigation />
                <Translate>
                    {({ translate }) => (
                        <Form
                            onSubmit={handleSubmit}
                            validate={values => {
                                const errors = {};
                                if (!values.title || values.title.length < 3) {
                                    errors.title = translate(
                                        'feedbackPost.errs.title_too_short',
                                        { min: 3 }
                                    );
                                }

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
                                values,
                                form,
                            }) => (
                                <form
                                    onSubmit={handleSubmit}
                                    className="ui form"
                                >
                                    <Field name="title">
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
                                                        'feedbackPost.form_fields.title'
                                                    )}
                                                </label>
                                                <input
                                                    {...input}
                                                    type="text"
                                                    placeholder={translate(
                                                        'feedbackPost.form_fields.title'
                                                    )}
                                                />
                                                <div className="form-error">
                                                    {meta.error &&
                                                        meta.touched && (
                                                            <span>
                                                                {meta.error}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </Field>

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
                                                        'feedbackPost.form_fields.suggestion'
                                                    )}
                                                </label>
                                                <div className="ui info message mini form-explanation">
                                                    {translate(
                                                        'feedbackPost.form_fields.markdown_supported'
                                                    )}
                                                </div>
                                                <textarea
                                                    {...input}
                                                    placeholder={translate(
                                                        'feedbackPost.form_fields.suggestion'
                                                    )}
                                                />

                                                <div className="form-error">
                                                    {meta.error &&
                                                        meta.touched && (
                                                            <span>
                                                                {meta.error}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </Field>

                                    <Button type="submit" disabled={submitting}>
                                        {translate(
                                            'feedbackPost.form_fields.submit'
                                        )}
                                    </Button>

                                    <h4>
                                        {translate(
                                            'feedbackPost.preview.header'
                                        )}
                                    </h4>
                                    <FeedbackSingleContent
                                        feedback={{
                                            title:
                                                values.title ||
                                                translate(
                                                    'feedbackPost.form_fields.title'
                                                ),
                                            date: new Date(),
                                            text:
                                                values.text ||
                                                translate(
                                                    'feedbackPost.form_fields.suggestion'
                                                ),
                                        }}
                                    />
                                </form>
                            )}
                        />
                    )}
                </Translate>
            </Container>
            <Footer />
        </div>
    );
};

FeedbackPost.propTypes = {
    /**
     * Func der poster feedback via redux
     */
    postFeedback: PropTypes.func,

    /**
     * History
     */
    history: ReactRouterPropTypes.history,
};

export default connect(
    null,
    actions
)(FeedbackPost);
