import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { urls } from '../../../utils/common';
import * as validation from '../../../utils/formValidation';
import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';

import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

// TODO: Autocomplete
class EditProfile extends Component {
    state = { message: null };

    handleNavigation = path => {
        this.props.history.push(urls[path]);
    };

    onSubmit = async values => {
        await this.props.editProfile(values, data => {
            this.setState({ message: data });
        });
    };

    render() {
        let { message } = this.state;
        return (
            <div className="flex-container">
                <Header />
                <Container className="content">
                    <h3>Herunder kan du ændre din email og dit kodeord</h3>
                    <Form
                        onSubmit={this.onSubmit}
                        initialValues={{ email: this.props.auth.user.email }}
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
                                        handleSubmit(event)
                                            .then(
                                                () =>
                                                    new Promise(
                                                        (resolve, reject) =>
                                                            this.props
                                                                .fetchUser()
                                                                .then(resolve)
                                                    )
                                            )
                                            .then(() => form.reset());
                                    }}
                                    className="ui form custom"
                                >
                                    <Field
                                        name="email"
                                        validate={validation.emailValid}
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
                                                <label>Email</label>
                                                <input
                                                    {...input}
                                                    type="email"
                                                    placeholder="E-mail"
                                                />
                                                {meta.error && meta.touched && (
                                                    <Message
                                                        error
                                                        visible={true}
                                                    >
                                                        {meta.error}
                                                    </Message>
                                                )}
                                                {meta.touched && !meta.error && (
                                                    <Message
                                                        warning
                                                        visible={true}
                                                    >
                                                        Du behøver ikke indtaste
                                                        en email-adresse, men
                                                        hvis du glemmer dine
                                                        loginoplysninger uden
                                                        den, kan du ikke få din
                                                        bruger tilbage.
                                                    </Message>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                    <Field
                                        name="password"
                                        validate={validation.passwordValid}
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
                                                <label>Nyt kodeord</label>
                                                <input
                                                    {...input}
                                                    type="password"
                                                    placeholder="Efterlad blankt for at beholde koden"
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
                                        validate={
                                            validation.passwordRepeatValid
                                        }
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
                                                <label>
                                                    Gentag nyt kodeord
                                                </label>
                                                <input
                                                    {...input}
                                                    type="password"
                                                    placeholder="Gentag nyt kodeord"
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
                                        Rediger profil
                                    </Button>

                                    <Button
                                        floated="right"
                                        basic
                                        color="yellow"
                                        onClick={() =>
                                            this.handleNavigation('profile')
                                        }
                                    >
                                        Tilbage til din profil
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

function mapStateToProps(state) {
    return { auth: state.auth };
}

export default connect(
    mapStateToProps,
    actions
)(EditProfile);
