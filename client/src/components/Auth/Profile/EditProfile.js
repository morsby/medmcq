import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { urls } from '../../../utils/common';
import * as validation from '../../../utils/formValidation';
import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';
import { Translate } from 'react-localize-redux';

// TODO: Autocomplete

/**
 * Component til at ændre profil.
 * Props er
 *  - history
 *  - editProfile (der gemmer ændringerne)
 *  - auth (brugeren)
 *  - fetchUser (der tjekker login)
 */
class EditProfile extends Component {
  handleNavigation = (path) => {
    this.props.history.push(urls[path]);
  };

  onSubmit = async (values) => {
    await this.props.editProfile(values);
  };

  render() {
    return (
      <div className="flex-container">
        <Container className="content">
          <h3>
            <Translate id="editProfile.header" />
          </h3>
          <p>
            <Translate id="editProfile.subheader" />
          </p>
          <Translate>
            {({ translate }) => (
              <Form
                onSubmit={this.onSubmit}
                initialValues={{
                  email: this.props.auth.user.email
                }}
                render={({ handleSubmit, pristine, invalid, form }) => {
                  return (
                    <form
                      onSubmit={(event) => {
                        handleSubmit(event)
                          .then(
                            () => new Promise((resolve) => this.props.fetchUser().then(resolve))
                          )
                          .then(() => form.reset());
                      }}
                      className="ui form custom"
                    >
                      <Field name="email" validate={validation.emailValid}>
                        {({ input, meta }) => (
                          <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                            <label>{translate('editProfile.form_fields.email')}</label>
                            <input
                              {...input}
                              type="email"
                              placeholder={translate('editProfile.form_fields.email')}
                            />
                            {meta.error && meta.touched && (
                              <Message error visible>
                                {meta.error}
                              </Message>
                            )}
                            {meta.touched && !meta.error && (
                              <Message warning visible>
                                {translate('signup.form_fields.email_not_required_message')}
                              </Message>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field name="password" validate={validation.passwordValid}>
                        {({ input, meta }) => (
                          <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                            <label>{translate('editProfile.form_fields.new_password')}</label>
                            <input
                              {...input}
                              type="password"
                              placeholder={translate(
                                'editProfile.form_fields.new_password_placeholder'
                              )}
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
                      <Field name="password-repeat" validate={validation.passwordRepeatValid}>
                        {({ input, meta }) => (
                          <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                            <label>
                              {translate('editProfile.form_fields.new_password_repeat')}
                            </label>
                            <input
                              {...input}
                              type="password"
                              placeholder={translate('editProfile.form_fields.new_password_repeat')}
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
                        {translate('editProfile.form_fields.submit')}
                      </Button>

                      <Button
                        floated="right"
                        basic
                        color="yellow"
                        onClick={() => this.handleNavigation('profile')}
                      >
                        {translate('editProfile.form_fields.abort')}
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

EditProfile.propTypes = {
  // React router -- til navigation
  history: ReactRouterPropTypes,

  // Til at gemme ændringer
  editProfile: PropTypes.func,

  // Brugerens info
  auth: PropTypes.object,

  // Til at tjekke login
  fetchUser: PropTypes.func
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(
  mapStateToProps,
  actions
)(EditProfile);
