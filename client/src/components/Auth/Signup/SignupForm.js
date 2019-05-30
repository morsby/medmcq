import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../../actions';

import { emailValid, passwordValid, passwordRepeatValid } from '../../../utils/formValidation';

import { validationRegex } from '../../../utils/common';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';
import { Translate, getTranslate } from 'react-localize-redux';

/**
 * Component der viser signup-form. Kaldes af ./Signup.js
 * Props ses i bunden.
 */
const SignupForm = ({ checkUserAvailability, signup, translate, history }) => {
  let onSubmit = async (values) => {
    signup(values).then(history.push('/login'));
  };

  const userAvailable = async (username) => {
    if (!username) {
      return translate('signup.errs.username_required');
    } else if (username.length < 3 || !username.match(validationRegex.username)) {
      return translate('signup.errs.username_invalid');
    } else {
      let available = await checkUserAvailability('username', username);

      return available ? null : translate('signup.errs.username_taken');
    }
  };

  const emailValidLocal = async (email) => {
    let error = emailValid(email);
    if (error) return error;

    let available = await checkUserAvailability('email', email);

    return available ? null : translate('signup.errs.email_taken');
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, pristine, invalid }) => {
        return (
          <form onSubmit={handleSubmit} className='ui form custom'>
            <Field name='username' validate={userAvailable}>
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.username')}</label>
                  <input
                    {...input}
                    type='text'
                    placeholder={translate('signup.form_fields.username')}
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
            <Field name='email' validate={emailValidLocal} validateFields={[]}>
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.email')}</label>
                  <input
                    {...input}
                    type='email'
                    placeholder={translate('signup.form_fields.email')}
                  />
                  {meta.error && meta.touched && (
                    <Message error visible>
                      {meta.error}
                    </Message>
                  )}
                  {meta.touched && !meta.error && (
                    <Message warning visible>
                      <Translate id='signup.form_fields.email_not_required_message' />
                    </Message>
                  )}
                </div>
              )}
            </Field>
            <Divider hidden />
            <Field name='password' validate={passwordValid} validateFields={['password-repeat']}>
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.password')}</label>
                  <input
                    {...input}
                    type='password'
                    placeholder={translate('signup.form_fields.password')}
                  />
                  {meta.error && meta.touched && (
                    <Message error visible size='small'>
                      {meta.error}
                    </Message>
                  )}
                </div>
              )}
            </Field>
            <Divider hidden />
            <Field
              name='password-repeat'
              validate={passwordRepeatValid}
              validateFields={['password']}
            >
              {({ input, meta }) => (
                <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                  <label>{translate('signup.form_fields.password_repeat')}</label>
                  <input
                    {...input}
                    type='password'
                    placeholder={translate('signup.form_fields.password_repeat')}
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
              <Translate id='signup.form_fields.submit' />
            </Button>
          </form>
        );
      }}
    />
  );
};

SignupForm.propTypes = {
  /**
   * Func der tjekker om brugernavn/email er brugt allerede
   * Fra redux
   */
  checkUserAvailability: PropTypes.func,

  /**
   * Func der opretter brugeren i DB
   * Fra redux
   */
  signup: PropTypes.func,

  /**
   * Func der kan oversætte strenge uden for (og inde i) React components
   * Fra react-localize-redux' Redux helpers
   */
  translate: PropTypes.func,

  /**
   * Fra react-router
   */
  history: ReactRouterPropTypes.history
};

function mapStateToProps (state) {
  return {
    currentLanguage: state.settings.language,
    translate: getTranslate(state.localize)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(SignupForm)
);
