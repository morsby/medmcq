import React from 'react';

import { useHistory } from 'react-router';

import { emailValid, passwordValid, passwordRepeatValid } from '../../../utils/formValidation';

import { validationRegex } from '../../../utils/common';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';
import { Translate, LocalizeContextProps, withLocalize } from 'react-localize-redux';
import User, { UserSignupInput } from 'classes/User';

/**
 * Component der viser signup-form. Kaldes af ./Signup.js
 * Props ses i bunden.
 */
export interface SignupFormProps extends LocalizeContextProps {}

const SignupForm: React.SFC<SignupFormProps> = ({ translate }) => {
  const history = useHistory();

  const handleSubmit = async (values: UserSignupInput) => {
    await User.signup(values);
    history.push('/login');
  };

  const userAvailable = async (username) => {
    if (!username) {
      return translate('signup.errs.username_required');
    } else if (username.length < 3 || !username.match(validationRegex.username)) {
      return translate('signup.errs.username_invalid');
    } else {
      let available = await User.checkAvailable({ username });

      return available ? null : translate('signup.errs.username_taken');
    }
  };

  const emailValidLocal = async (email) => {
    let error = emailValid(email);
    if (error) return error;

    let available = await User.checkAvailable({ email });

    return available ? null : translate('signup.errs.email_taken');
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit, pristine, invalid }) => {
        return (
          <form onSubmit={handleSubmit} className="ui form custom">
            <Field name="username" validate={userAvailable}>
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.username')}</label>
                  <input
                    {...input}
                    type="text"
                    placeholder={translate('signup.form_fields.username') as string}
                  />
                  {meta.error && meta.touched && (
                    <Message error visible>
                      {meta.error}
                    </Message>
                  )}
                </div>
              )}
            </Field>
            <Divider hidden />
            <Field name="email" validate={emailValidLocal} validateFields={[]}>
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.email')}</label>
                  <input
                    {...input}
                    type="email"
                    placeholder={translate('signup.form_fields.email') as string}
                  />
                  {meta.error && meta.touched && (
                    <Message error visible>
                      {meta.error}
                    </Message>
                  )}
                  {meta.touched && !meta.error && (
                    <Message warning visible>
                      <Translate id="signup.form_fields.email_not_required_message" />
                    </Message>
                  )}
                </div>
              )}
            </Field>
            <Divider hidden />
            <Field name="password" validate={passwordValid} validateFields={['password-repeat']}>
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.password')}</label>
                  <input
                    {...input}
                    type="password"
                    placeholder={translate('signup.form_fields.password') as string}
                  />
                  {meta.error && meta.touched && (
                    <Message error visible size="small">
                      {meta.error}
                    </Message>
                  )}
                </div>
              )}
            </Field>
            <Divider hidden />
            <Field
              name="password-repeat"
              validate={passwordRepeatValid}
              validateFields={['password']}
            >
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.password_repeat')}</label>
                  <input
                    {...input}
                    type="password"
                    placeholder={translate('signup.form_fields.password_repeat') as string}
                  />
                  {meta.error && meta.touched && (
                    <Message error visible>
                      {meta.error}
                    </Message>
                  )}
                </div>
              )}
            </Field>
            <Divider hidden />
            <Button disabled={pristine || invalid}>
              <Translate id="signup.form_fields.submit" />
            </Button>
          </form>
        );
      }}
    />
  );
};

export default withLocalize(SignupForm);
