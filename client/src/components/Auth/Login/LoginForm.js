import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../../actions';

import { urls } from '../../../utils/common';
import { loginUsernameValid, loginPasswordValid } from '../../../utils/formValidation';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

/**
 * Component der viser login-formularen.
 * Kaldes af ./Login.js
 * Props er history (fra react-router) og login (fra redux)
 */
class LoginForm extends Component {
  state = { error: null };

  handleNavigation = (path) => {
    this.props.history.push(urls[path]);
  };

  onSubmit = async (values) => {
    let login = await this.props.login(values);

    if (login.type === 'LoginSuccess') {
      return this.handleNavigation('profile');
    } else {
      this.setState({ error: 'Login mislykkedes' });
    }
  };

  // TODO: Autocomplete
  render () {
    return (
      <div>
        <Translate>
          {({ translate }) => (
            <Form
              onSubmit={this.onSubmit}
              render={({ handleSubmit, pristine, invalid }) => (
                <form onSubmit={handleSubmit} className='ui form custom'>
                  <Field name='username' validate={loginUsernameValid}>
                    {({ input, meta }) => (
                      <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                        <label>{translate('loginForm.username')}</label>
                        <input
                          {...input}
                          type='text'
                          placeholder={translate('loginForm.username')}
                        />

                        {meta.error && meta.touched && (
                          <Message error visible>
                            {meta.error}
                          </Message>
                        )}
                      </div>
                    )}
                  </Field>

                  <Field name='password' validate={loginPasswordValid}>
                    {({ input, meta }) => (
                      <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                        <label>{translate('loginForm.password')}</label>
                        <input
                          {...input}
                          type='password'
                          placeholder={translate('loginForm.password')}
                        />
                        {meta.error && meta.touched && (
                          <Message error visible size='small'>
                            {meta.error}
                          </Message>
                        )}
                      </div>
                    )}
                  </Field>
                  {this.state.error && (
                    <Message negative>{translate('loginForm.errs.login_failed')}</Message>
                  )}
                  <Divider hidden />
                  <Message warning visible>
                    <Message.Header>Mellemrum i brugernavne</Message.Header>
                    <p>
                      Vi har fjernet alle mellemrum fra brugernavne. Har du før logget ind med et
                      brugernavn, skal du blot fjerne dette for at logge ind.
                    </p>
                    <p>
                      Indtil sommerferien kan du dog stadig logge ind, som du plejer <em>med</em>{' '}
                      mellemrum.
                    </p>
                  </Message>
                  <Divider hidden />
                  <Button floated='left' disabled={pristine || invalid} positive>
                    {translate('loginForm.login')}
                  </Button>
                </form>
              )}
            />
          )}
        </Translate>
        <div style={{ float: 'right' }}>
          <Button onClick={() => this.handleNavigation('forgotPassword')} color='blue'>
            <Translate id='loginForm.forgot_password' />
          </Button>
          <Button onClick={() => this.handleNavigation('signup')}>
            <Translate id='loginForm.signup' />
          </Button>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  /**
   * Func der kalder login via API'en
   */
  login: PropTypes.func,

  history: ReactRouterPropTypes.history
};

function mapStateToProps (state) {
  return {
    auth: state.auth
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(LoginForm)
);
