import React, { useState } from 'react';
import { urls } from '../../utils/common';
import { Button, Divider, Form, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import User from 'classes/User';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import FormField from './Fields/FormField';

/**
 * Component der viser login-formularen.
 * Kaldes af ./Login.js
 */
export interface LoginFormProps {}

const LoginForm: React.SFC<LoginFormProps> = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (values) => {
      onSubmit({ username: values.username, password: values.password });
    }
  });

  const handleNavigation = (path) => {
    history.push(urls[path]);
  };

  const onSubmit = async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      const user = await User.login(data);
      if (!user) {
        return setError('Login mislykkedes');
      }

      return handleNavigation('root');
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Translate>
        {({ translate }) => (
          <Form onSubmit={formik.handleSubmit}>
            <FormField
              name="username"
              placeholder={translate('loginForm.username') as string}
              onChange={formik.handleChange}
              formik={formik}
            />
            <FormField
              name="password"
              placeholder={translate('loginForm.password') as string}
              onChange={formik.handleChange}
              formik={formik}
            />

            <Divider hidden />
            <Button loading={loading} floated="left" disabled={!formik.isValid || loading} positive>
              {translate('loginForm.login')}
            </Button>
            {error && <Message color="red">{error}</Message>}
          </Form>
        )}
      </Translate>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}
      >
        <Button color="blue" onClick={() => handleNavigation('signup')}>
          <Translate id="loginForm.signup" />
        </Button>
        <Button onClick={() => handleNavigation('forgotPassword')}>
          <Translate id="loginForm.forgot_password" />
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
