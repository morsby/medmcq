import React, { useState } from 'react';
import { urls } from '../../utils/common';
import { Button, Divider, Form } from 'semantic-ui-react';
import { Translate, withLocalize, LocalizeContextProps } from 'react-localize-redux';
import User from 'classes/User';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import FormField from './Fields/FormField';
import { useDispatch } from 'react-redux';
import makeToast from 'redux/actions/makeToast';

/**
 * Component der viser login-formularen.
 * Kaldes af ./Login.js
 */
export interface LoginFormProps extends LocalizeContextProps {}

const LoginForm: React.SFC<LoginFormProps> = ({ translate }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
        return dispatch(makeToast('loginForm.errs.login_failed', 'error'));
      }

      return handleNavigation('root');
    } catch (error) {
      dispatch(makeToast('loginForm.errs.login_failed', 'error'));
      setLoading(false);
    }
  };

  return (
    <div>
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
      </Form>

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
    </div>
  );
};

export default withLocalize(LoginForm);
