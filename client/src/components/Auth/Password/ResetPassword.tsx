import React, { useState } from 'react';

import { passwordValid, passwordRepeatValid } from '../../../utils/formValidation';

import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';
import { Translate } from 'react-localize-redux';
import { useParams } from 'react-router-dom';
import User from 'classes/User';

/**
 * Component der nulstiller kodeordet hvis URL'ens token er gyldigt.
 * Props er resetPassword (fra redux) og token der hentes via URL.
 *
 */
export interface ResetPasswordProps {}

const ResetPassword: React.SFC<ResetPasswordProps> = () => {
  const [message, setMessage] = useState('');
  const token = useParams<{ token: string }>().token;

  const handleSubmit = async (values) => {
    console.log(values);
    // const message = await User.resetPassword({ token, values });
    // setMessage(message);
  };

  return (
    <div className="flex-container">
      <Container className="content">
        <h3>
          <Translate id="resetPassword.header" />
        </h3>
        <Translate>
          {({ translate }) => (
            <Form
              onSubmit={handleSubmit}
              render={({ handleSubmit, pristine, invalid, form }) => {
                return (
                  <form
                    onSubmit={(event) => {
                      handleSubmit(event).then(form.reset);
                    }}
                    className="ui form custom"
                  >
                    <Field name="password" validate={passwordValid}>
                      {({ input, meta }) => (
                        <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                          <label>{translate('resetPassword.password')}</label>
                          <input
                            {...input}
                            type="password"
                            placeholder={translate('resetPassword.password') as string}
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
                    <Field name="password-repeat" validate={passwordRepeatValid}>
                      {({ input, meta }) => (
                        <div className={'field ' + (meta.error && meta.touched ? 'error' : '')}>
                          <label>{translate('resetPassword.password_repeat')}</label>
                          <input
                            {...input}
                            type="password"
                            placeholder={translate('resetPassword.password_repeat') as string}
                          />
                          {meta.error && meta.touched && (
                            <Message error visible>
                              {meta.error}
                            </Message>
                          )}
                        </div>
                      )}
                    </Field>
                    {message && <Message>{message}</Message>}
                    <Divider hidden />
                    <Button disabled={pristine || invalid}>
                      <Translate id="resetPassword.submit" />
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
};

export default ResetPassword;
