import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { urls } from '../../../utils/common';
import { loginUsernameValid, loginPasswordValid } from '../../../utils/formValidation';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { IReduxState } from 'reducers/index.js';
import User from 'classes/User';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';

/**
 * Component der viser login-formularen.
 * Kaldes af ./Login.js
 * Props er history (fra react-router) og login (fra redux)
 */
const LoginForm = () => {
  const [error, setError] = useState('');
  const auth = useSelector((state: IReduxState) => state.auth);
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['user']);
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    history.push(urls[path]);
  };

  const onSubmit = async (values) => {
    const user = await User.login(values);

    if (!user) {
      return setError('Login mislykkedes');
    }

    return handleNavigation('root');
  };

  return (
    <>
      <Translate>
        {({ translate }) => (
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, pristine, invalid }) => (
              <form onSubmit={handleSubmit} className="ui form custom">
                <Field name="username" validate={loginUsernameValid}>
                  {({ input, meta }) => (
                    <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                      <label>{translate('loginForm.username')}</label>
                      <input
                        {...input}
                        type="text"
                        placeholder={translate('loginForm.username') as any}
                      />

                      {meta.error && meta.touched && (
                        <Message error visible>
                          {meta.error}
                        </Message>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="password" validate={loginPasswordValid}>
                  {({ input, meta }) => (
                    <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                      <label>{translate('loginForm.password')}</label>
                      <input
                        {...input}
                        type="password"
                        placeholder={translate('loginForm.password') as any}
                      />
                      {meta.error && meta.touched && (
                        <Message error visible size="small">
                          {meta.error}
                        </Message>
                      )}
                    </div>
                  )}
                </Field>
                {error && <Message negative>{translate('loginForm.errs.login_failed')}</Message>}
                <Divider hidden />
                <Button floated="left" disabled={pristine || invalid} positive>
                  {translate('loginForm.login')}
                </Button>
              </form>
            )}
          />
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
