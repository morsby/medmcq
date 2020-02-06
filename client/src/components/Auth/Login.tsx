import React from 'react';

import { Container } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import LoginForm from '../Forms/LoginForm';

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
    </div>
  );
};

export default Login;
