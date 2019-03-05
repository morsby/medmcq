import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { Container, Message, Form, Button } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import Footer from '../../Layout/Footer';

/**
 * Component der viser formular til at bede om nyt password
 * @extends Component
 */
class ForgotPassword extends Component {
    state = { email: '', message: null };

    handleChange = (e, { name, value }) =>
        this.setState({ [name]: value, message: null });

    handleSubmit = () => {
        const { email } = this.state;

        this.props.forgotPassword(email, data =>
            this.setState({ message: data, email: '' })
        );
    };

    render() {
        let { message } = this.state;
        return (
            <div className="flex-container">
                <Container className="content">
                    <h3>
                        <Translate id="forgotPassword.header" />
                    </h3>
                    <p>
                        <Translate id="forgotPassword.guide" />
                    </p>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <label>E-mail</label>
                            <Form.Input
                                name="email"
                                placeholder="E-mail"
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                        </Form.Field>
                        {message && (
                            <Message
                                negative={message.type === 'error'}
                                positive={message.type === 'success'}
                            >
                                {message.data}
                            </Message>
                        )}
                        <Button type="submit">Send email</Button>
                    </Form>
                </Container>
                <Footer />
            </div>
        );
    }
}

ForgotPassword.propTypes = {
    /**
     * Func der nulstiller kodeord og sender en email (via API). Fra redux
     */
    forgotPassword: PropTypes.func,
};

export default connect(
    null,
    actions
)(ForgotPassword);
