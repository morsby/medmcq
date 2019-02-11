import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import {
    passwordValid,
    passwordRepeatValid,
} from '../../../utils/formValidation';

import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';

import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

/**
 * Component der nulstiller kodeordet hvis URL'ens token er gyldigt.
 * Props er resetPassword (fra redux) og token der hentes via URL.
 *
 */
class ResetPassword extends Component {
    state = { message: null };

    onSubmit = async values => {
        let token = this.props.match.params.token;
        await this.props.resetPassword(token, values, data => {
            this.setState({ message: data });
        });
    };

    render() {
        let { message } = this.state;
        return (
            <div className="flex-container">
                <Header />
                <Container className="content">
                    <h3>Indtast dit nye kodeord</h3>
                    <Form
                        onSubmit={this.onSubmit}
                        render={({
                            handleSubmit,
                            pristine,
                            invalid,
                            values,
                            form,
                        }) => {
                            return (
                                <form
                                    onSubmit={event => {
                                        handleSubmit(event).then(form.reset());
                                    }}
                                    className="ui form custom"
                                >
                                    <Field
                                        name="password"
                                        validate={passwordValid}
                                    >
                                        {({ input, meta }) => (
                                            <div
                                                className={
                                                    'field ' +
                                                    (meta.error && meta.touched
                                                        ? 'error'
                                                        : '')
                                                }
                                            >
                                                <label>Kodeord</label>
                                                <input
                                                    {...input}
                                                    type="password"
                                                    placeholder="Kodeord"
                                                />
                                                {meta.error && meta.touched && (
                                                    <Message
                                                        error
                                                        visible={true}
                                                        size="small"
                                                    >
                                                        {meta.error}
                                                    </Message>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                    <Divider hidden />
                                    <Field
                                        name="password-repeat"
                                        validate={passwordRepeatValid}
                                    >
                                        {({ input, meta }) => (
                                            <div
                                                className={
                                                    'field ' +
                                                    (meta.error && meta.touched
                                                        ? 'error'
                                                        : '')
                                                }
                                            >
                                                <label>Gentag kodeord</label>
                                                <input
                                                    {...input}
                                                    type="password"
                                                    placeholder="Gentag kodeord"
                                                />
                                                {meta.error && meta.touched && (
                                                    <Message
                                                        error
                                                        visible={true}
                                                    >
                                                        {meta.error}
                                                    </Message>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                    {message && (
                                        <Message
                                            negative={message.type === 'error'}
                                            positive={
                                                message.type === 'success'
                                            }
                                        >
                                            {message.data}
                                        </Message>
                                    )}
                                    <Divider hidden />
                                    <Button disabled={pristine || invalid}>
                                        Skift kodeord
                                    </Button>
                                </form>
                            );
                        }}
                    />
                </Container>
                <Footer />
            </div>
        );
    }
}

export default connect(
    null,
    actions
)(ResetPassword);
