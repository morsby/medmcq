import React from 'react';

import { Container } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import Footer from '../../Layout/Footer';
import LoginForm from './LoginForm';

/**
 * Component der kalder loginform.
 */
const Login = () => {
  return (
    <div className="flex-container">
      <Container className="content">
        <h3>
          <Translate id="login.header" />
        </h3>
        <LoginForm />
      </Container>
      <Footer />
    </div>
  );
};

export default Login;
