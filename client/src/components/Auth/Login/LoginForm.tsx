import React, { useState } from 'react';
import { urls } from '../../../utils/common';
import { Button, Divider, Form } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import User from 'classes/User';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import FormField from './FormField';
import { loginSchema } from 'utils/validationSchemas';

/**
 * Component der viser login-formularen.
 * Kaldes af ./Login.js
 */
export interface LoginFormProps {}

const LoginForm: React.SFC<LoginFormProps> = () => {
  const [error, setError] = useState('');
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      onSubmit({ username: values.username, password: values.password });
    }
  });

  const handleNavigation = (path) => {
    history.push(urls[path]);
  };

  const onSubmit = async (data: { username: string; password: string }) => {
    const user = await User.login(data);

    if (!user) {
      return setError('Login mislykkedes');
    }

    return handleNavigation('root');
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
              touched={formik.touched.username}
              value={formik.values.username}
              error={formik.errors.username}
            />
            <FormField
              name="password"
              placeholder={translate('loginForm.password') as string}
              onChange={formik.handleChange}
              touched={formik.touched.password}
              value={formik.values.password}
              error={formik.errors.password}
            />

            <Divider hidden />
            <Button floated="left" disabled={!formik.isValid} positive>
              {translate('loginForm.login')}
            </Button>
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
