import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import { urls } from "../../utils/common";

import { Container, Message, Button, Divider } from "semantic-ui-react";
import { Form, Field } from "react-final-form";

import Header from "../Misc/Header";
import Footer from "../Misc/Footer";

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

    emailValid = email => {
        if (!email) return "";
        const validator = new RegExp(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        );
        let res = validator.test(email);
        return res ? "" : "Ikke en gyldig adresse";
    };

    passwordValid = pwd => {
        if (!pwd) {
            return "";
        } else {
            const uppercase = new RegExp("[A-Z]").test(pwd);
            const lowercase = new RegExp("[a-z]").test(pwd);
            const nums = new RegExp("[0-9]").test(pwd);
            const special = new RegExp("[^A-Za-z0-9]").test(pwd);
            const length = pwd.length >= 8;

            let validator = [uppercase, lowercase, nums, special];

            let strength = 0;
            validator.map(e => {
                if (e) strength++;
                return null;
            });

            if (strength < 3 || !length) {
                return "Skal være mindst 8 tegn og kræver mindst tre af følgende: store bogstaver, små bogstaver, tal, specielle tegn.";
            } else return null;
        }
    };

    passwordRepeatValid = (pwdRepeat, allValues) => {
        if (pwdRepeat !== allValues.password) {
            return "De to adgangskoder matcher ikke";
        } else return null;
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
                            form
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
                                        validate={this.emailValid}
                                    >
                                        {({ input, meta }) => (
                                            <div
                                                className={
                                                    "field " +
                                                    (meta.error && meta.touched
                                                        ? "error"
                                                        : "")
                                                }
                                            >
                                                <label>Email</label>
                                                <input
                                                    {...input}
                                                    type="email"
                                                    placeholder="E-mail"
                                                />
                                                {meta.error &&
                                                    meta.touched && (
                                                        <Message
                                                            error
                                                            visible={true}
                                                        >
                                                            {meta.error}
                                                        </Message>
                                                    )}
                                                {meta.touched &&
                                                    !meta.error && (
                                                        <Message
                                                            warning
                                                            visible={true}
                                                        >
                                                            Du behøver ikke
                                                            indtaste en
                                                            email-adresse, men
                                                            hvis du glemmer dine
                                                            loginoplysninger
                                                            uden den, kan du
                                                            ikke få din bruger
                                                            tilbage.
                                                        </Message>
                                                    )}
                                            </div>
                                        )}
                                    </Field>
                                    <Field
                                        name="password"
                                        validate={this.passwordValid}
                                    >
                                        {({ input, meta }) => (
                                            <div
                                                className={
                                                    "field " +
                                                    (meta.error && meta.touched
                                                        ? "error"
                                                        : "")
                                                }
                                            >
                                                <label>Nyt kodeord</label>
                                                <input
                                                    {...input}
                                                    type="password"
                                                    placeholder="Efterlad blankt for at beholde koden"
                                                />
                                                {meta.error &&
                                                    meta.touched && (
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
                                        validate={this.passwordRepeatValid}
                                    >
                                        {({ input, meta }) => (
                                            <div
                                                className={
                                                    "field " +
                                                    (meta.error && meta.touched
                                                        ? "error"
                                                        : "")
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
                                                {meta.error &&
                                                    meta.touched && (
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
                                            negative={message.type === "error"}
                                            positive={
                                                message.type === "success"
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
                                            this.handleNavigation("profile")
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
