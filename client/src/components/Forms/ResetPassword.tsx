import React, { useState } from 'react';

import { Container, Button, Divider, Form } from 'semantic-ui-react';
import { Translate, LocalizeContextProps, withLocalize } from 'react-localize-redux';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import FormField from './Fields/FormField';
import { resetSchema } from 'utils/validationSchemas';
import User from 'classes/User';

/**
 * Component der nulstiller kodeordet hvis URL'ens token er gyldigt.
 * Props er resetPassword (fra redux) og token der hentes via URL.
 *
 */
export interface ResetPasswordProps extends LocalizeContextProps {}

const ResetPassword: React.SFC<ResetPasswordProps> = ({ translate }) => {
  const [message, setMessage] = useState('');
  const token = useParams<{ token: string }>().token;
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: resetSchema,
    onSubmit: () => handleSubmit(),
    validateOnBlur: true
  });

  const handleSubmit = async () => {
    const message = await User.resetPassword({ token, password: formik.values.password });
    setMessage(message);
  };

  if (message)
    return (
      <div className="flex-container">
        <Container className="content">
          <h3>{message.toTitleCase()}</h3>
        </Container>
      </div>
    );
  return (
    <div className="flex-container">
      <Container className="content">
        <h3>
          <Translate id="resetPassword.header" />
        </h3>
        <Form onSubmit={formik.handleSubmit}>
          <FormField
            name="password"
            placeholder={translate('resetPassword.password') as string}
            onChange={formik.handleChange}
            formik={formik}
            shouldValidate
          />
          <FormField
            name="confirmPassword"
            placeholder={translate('resetPassword.password_repeat') as string}
            formik={formik}
            onChange={formik.handleChange}
            shouldValidate
          />
          <Divider hidden />
          <Button disabled={!formik.isValid} type="submit">
            <Translate id="resetPassword.submit" />
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default withLocalize(ResetPassword);
