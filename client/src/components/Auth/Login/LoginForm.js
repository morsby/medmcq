import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../../actions';

import { urls } from '../../../utils/common';
import {
    loginUsernameValid,
    loginPasswordValid,
} from '../../../utils/formValidation';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';

/**
 * Component der viser login-formularen.
 * Kaldes af ./Login.js
 * Props er history (fra react-router) og login (fra redux)
 */
class LoginForm extends Component {
    state = { error: null };

    handleNavigation = path => {
        this.props.history.push(urls[path]);
    };

    onSubmit = async values => {
        let login = await this.props.login(values);

        if (login.type === 'success') {
            return this.handleNavigation('profile');
        } else {
            this.setState({ error: 'Login mislykkedes' });
        }
    };

    // TODO: Autocomplete
    render() {
        return (
            <div>
                <Form
                    onSubmit={this.onSubmit}
                    render={({ handleSubmit, pristine, invalid }) => (
                        <form
                            onSubmit={handleSubmit}
                            className="ui form custom"
                        >
                            <Field
                                name="username"
                                validate={loginUsernameValid}
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
                                        <label>Brugernavn</label>
                                        <input
                                            {...input}
                                            type="text"
                                            placeholder="Brugernavn"
                                        />
                                        {meta.error && meta.touched && (
                                            <Message error visible={true}>
                                                {meta.error}
                                            </Message>
                                        )}
                                    </div>
                                )}
                            </Field>

                            <Field
                                name="password"
                                validate={loginPasswordValid}
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
                            {this.state.error && (
                                <Message negative>{this.state.error}</Message>
                            )}
                            <Divider hidden />
                            <Button
                                floated="left"
                                disabled={pristine || invalid}
                                positive
                            >
                                Log ind
                            </Button>
                        </form>
                    )}
                />
                <div style={{ float: 'right' }}>
                    <Button
                        onClick={() => this.handleNavigation('forgotPassword')}
                        color="blue"
                    >
                        Glemt kodeord?
                    </Button>
                    <Button onClick={() => this.handleNavigation('signup')}>
                        Opret bruger
                    </Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(LoginForm)
);
