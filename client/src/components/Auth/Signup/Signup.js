import React from 'react';

import { Container, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import Footer from '../../Layout/Footer';
import SignupForm from './SignupForm';

/**
 * Component der viser info om registrering.
 */
const Signup = () => {
    return (
        <div className="flex-container">
            <Container className="content">
                <h3>
                    <Translate id="signup.header" />
                </h3>
                <SignupForm />
                <Message info>
                    <Message.Header>
                        <Translate id="signup.privacy_message.header" />
                    </Message.Header>
                    <Message.Content>
                        <Translate id="signup.privacy_message.body" />
                    </Message.Content>
                </Message>
            </Container>
            <Footer />
        </div>
    );
};

export default Signup;
