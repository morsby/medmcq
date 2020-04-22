import React, { useState } from 'react';

import { useHistory } from 'react-router';

import { Form, Divider, Icon } from 'semantic-ui-react';
import { Translate, LocalizeContextProps, withLocalize } from 'react-localize-redux';
import User from 'classes/User';
import { signupSchema } from 'utils/validationSchemas';
import { useFormik } from 'formik';
import FormField from './Fields/FormField';
import DebouncedField from './Fields/DebouncedField';

export interface SignupFormProps extends LocalizeContextProps {}

const SignupForm: React.SFC<SignupFormProps> = ({ translate }) => {
  const [hasError, setHasError] = useState({
    username: false,
    email: false
  });
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: (values) => handleSubmit(values),
    validationSchema: signupSchema,
    validateOnBlur: true
  });

  const handleSubmit = async ({ username, email, password }) => {
    await User.signup({ username, email, password });
    history.push('/');
  };

  const handleError = (hasError: boolean, name: string) => {
    setHasError((prevState) => ({ ...prevState, [name]: hasError }));
  };

  const debouncedFields = ['username', 'email'];
  const fields = ['password', 'confirmPassword'];
  return (
    <div>
      <Form onSubmit={formik.handleSubmit}>
        {debouncedFields.map((name) => (
          <DebouncedField
            key={name}
            name={name}
            formik={formik}
            onChange={formik.handleChange}
            placeholder={translate(`signup.form_fields.${name}`) as string}
            onValidateError={(hasError) => handleError(hasError, name)}
            shouldValidate
          />
        ))}
        {fields.map((name) => (
          <FormField
            key={name}
            name={name}
            formik={formik}
            onChange={formik.handleChange}
            placeholder={translate(`signup.form_fields.${name}`) as string}
            shouldValidate
          />
        ))}
        <Divider hidden />
        <Form.Button
          disabled={!formik.isValid || hasError.username || hasError.email}
          color="green"
          type="submit"
        >
          <Icon name="check" /> <Translate id="signup.form_fields.submit" />
        </Form.Button>
      </Form>
    </div>
  );
};

export default withLocalize(SignupForm);
