import React from 'react';

import { Container, Button, Divider } from 'semantic-ui-react';
import { Form } from 'react-final-form';
import { Translate } from 'react-localize-redux';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import FormField from '../Login/FormField';
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
