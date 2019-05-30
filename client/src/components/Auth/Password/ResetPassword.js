import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { passwordValid, passwordRepeatValid } from '../../../utils/formValidation';

import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';
import { Translate } from 'react-localize-redux';

/**
 * Component der nulstiller kodeordet hvis URL'ens token er gyldigt.
 * Props er resetPassword (fra redux) og token der hentes via URL.
 *
 */
class ResetPassword extends Component {
  state = { message: null };

  onSubmit = async (values) => {
    let token = this.props.match.params.token;
    await this.props.resetPassword(token, values, (data) => {
      this.setState({ message: data });
    });
  };

  render () {
    let { message } = this.state;
    return (
      <div className='flex-container'>
        <Container className='content'>
          <h3>
            <Translate id='resetPassword.header' />
          </h3>
          <Translate>
            {({ translate }) => (
              <Form
                onSubmit={this.onSubmit}
                render={({ handleSubmit, pristine, invalid, form }) => {
                  return (
                    <form
                      onSubmit={(event) => {
                        handleSubmit(event).then(form.reset());
                      }}
                      className='ui form custom'
                    >
                      <Field name='password' validate={passwordValid}>
                        {({ input, meta }) => (
                          <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                            <label>{translate('resetPassword.password')}</label>
                            <input
                              {...input}
                              type='password'
                              placeholder={translate('resetPassword.password')}
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
                      <Field name='password-repeat' validate={passwordRepeatValid}>
                        {({ input, meta }) => (
                          <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                            <label>{translate('resetPassword.password_repeat')}</label>
                            <input
                              {...input}
                              type='password'
                              placeholder={translate('resetPassword.password_repeat')}
                            />
                            {meta.error && meta.touched && (
                              <Message error visible>
                                {meta.error}
                              </Message>
                            )}
                          </div>
                        )}
                      </Field>
                      {message && (
                        <Message
                          negative={message.type === 'error'}
                          positive={message.type === 'success'}
                        >
                          {message.data}
                        </Message>
                      )}
                      <Divider hidden />
                      <Button disabled={pristine || invalid}>
                        <Translate id='resetPassword.submit' />
                      </Button>
                    </form>
                  );
                }}
              />
            )}
          </Translate>
        </Container>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  /**
   * Func der nulstiller koden
   */
  resetPassword: PropTypes.func,

  /**
   * fra react-router. Til at få token fra url
   */
  match: ReactRouterPropTypes.match
};

export default connect(
  null,
  actions
)(ResetPassword);
