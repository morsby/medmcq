import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { Container, Message, Form, Button } from 'semantic-ui-react';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';

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
                <Header />
                <Container className="content">
                    <h3>Glemt kodeord?</h3>
                    <p>
                        Indtast din emailadresse nedenfor, og du vil modtage en
                        mail med et link til nulstilling af dit kodeord. Du har
                        1 time til at gøre dette – ellers må du prøve igen.
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

export default connect(
    null,
    actions
)(ForgotPassword);
