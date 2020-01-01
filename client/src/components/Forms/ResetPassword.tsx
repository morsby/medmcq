import React from 'react';

import { Container, Button, Divider, Form } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import FormField from './Fields/FormField';
import { resetSchema } from 'utils/validationSchemas';

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
                placeholder={translate('resetPassword.password') as string}
                onChange={formik.handleChange}
                formik={formik}
                shouldValidate
              />
              <FormField
                name="password-repeat"
                placeholder={translate('resetPassword.password_repeat') as string}
                formik={formik}
                onChange={formik.handleChange}
                shouldValidate
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
