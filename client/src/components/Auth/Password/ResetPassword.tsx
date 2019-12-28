import React, { useState } from 'react';

import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form } from 'react-final-form';
import { Translate } from 'react-localize-redux';
import { useParams } from 'react-router-dom';
import User from 'classes/User';
import { useFormik } from 'formik';
import FormField from '../Login/FormField';
import Yup from 'yup';
import { validationRegex } from 'utils/common';
const resetSchema = Yup.object().shape({
  password: Yup.string()
    .matches(validationRegex.password)
    .required(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Kodeord skal være ens')
});

/**
 * Component der nulstiller kodeordet hvis URL'ens token er gyldigt.
 * Props er resetPassword (fra redux) og token der hentes via URL.
 *
 */
export interface ResetPasswordProps {}

const ResetPassword: React.SFC<ResetPasswordProps> = () => {
  const token = useParams<{ token: string }>().token;
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: resetSchema,
    onSubmit: (values) => handleSubmit(values)
  });

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
            <Form onSubmit={formik.handleSubmit}>
              <FormField
                name="password"
                value={formik.values.password}
                placeholder={translate('resetPassword.password') as string}
                error={formik.errors.password}
                touched={formik.touched.password}
                onChange={formik.handleChange}
              />
              <FormField
                name="password-repeat"
                value={formik.values.password}
                placeholder={translate('resetPassword.password_repeat') as string}
                error={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
                onChange={formik.handleChange}
              />
              <Divider hidden />
              <Button disabled={formik.isValid}>
                <Translate id="resetPassword.submit" />
              </Button>
            </Form>
          )}
        </Translate>
      </Container>
    </div>
  );
};

export default ResetPassword;
