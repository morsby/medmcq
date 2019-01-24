import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../../actions';

import {
    emailValid,
    passwordValid,
    passwordRepeatValid,
} from '../../../utils/formValidation';

import { validationRegex } from '../../../utils/common';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';

const SignupForm = props => {
    let onSubmit = async values => {
        props
            .signup(values)
            .then(props.fetchUser())
            .then(props.history.push('/login'));
    };

    const userAvailable = async username => {
        if (!username) {
            return 'Du skal udfylde et brugernavn!';
        } else if (
            username.length < 3 ||
            !username.match(validationRegex.username)
        ) {
            return `Ugyldigt brugernavn. Brugernavne skal være mindst 3 tegn og må ikke indeholde mellemrum. 
            Gyldige brugernavne er f.eks. sigurd, sig_urd, sig.urd og sigurd123`;
        } else {
            let available = await props.checkUserAvailability(
                'username',
                username
            );

            return available ? null : 'Brugernavnet er taget';
        }
    };

    const emailValidLocal = async email => {
        let error = emailValid(email);
        if (error) return error;

        let available = await props.checkUserAvailability('email', email);

        return available ? null : 'Emailen er allerede brugt';
    };

    return (
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, pristine, invalid }) => {
                return (
                    <form onSubmit={handleSubmit} className="ui form custom">
                        <Field name="username" validate={userAvailable}>
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
                        <Divider hidden />
                        <Field
                            name="email"
                            validate={emailValidLocal}
                            validateFields={[]}
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
                                        placeholder="Email"
                                    />
                                    {meta.error && meta.touched && (
                                        <Message error visible={true}>
                                            {meta.error}
                                        </Message>
                                    )}
                                    {meta.touched && !meta.error && (
                                        <Message warning visible={true}>
                                            Du behøver ikke indtaste en
                                            email-adresse, men hvis du glemmer
                                            dine loginoplysninger uden den, kan
                                            du ikke få din bruger tilbage.
                                        </Message>
                                    )}
                                </div>
                            )}
                        </Field>
                        <Divider hidden />
                        <Field
                            name="password"
                            validate={passwordValid}
                            validateFields={['password-repeat']}
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
                            validateFields={['password']}
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
                                        <Message error visible={true}>
                                            {meta.error}
                                        </Message>
                                    )}
                                </div>
                            )}
                        </Field>
                        <Divider hidden />
                        <Button disabled={pristine || invalid}>
                            Opret bruger
                        </Button>
                    </form>
                );
            }}
        />
    );
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(SignupForm)
);
