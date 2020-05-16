import React, { useState } from 'react';
import { Form, Icon, Container, Divider } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import User from 'classes/User';
import { withLocalize, LocalizeContextProps } from 'react-localize-redux';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import DebouncedField from './Fields/DebouncedField';
import FormField from './Fields/FormField';
import { editProfileSchema } from 'utils/validationSchemas';
import { UserInput } from 'types/generated';

export interface EditProfileProps extends LocalizeContextProps {}

const EditProfile: React.SFC<EditProfileProps> = ({ translate }) => {
  const history = useHistory();
  const [hasError, setHasError] = useState({
    email: false
  });
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      email: user.email || ''
    },
    onSubmit: (values) => handleSubmit(values),
    validationSchema: editProfileSchema
  });

  const handleSubmit = async ({ password, email }: Partial<UserInput>) => {
    if (!formik.isValid) return;
    setLoading(true);
    await User.edit({ password, email });
    await User.fetch();
    history.push('/profil');
  };

  const handleError = (hasError: boolean, name: string) => {
    setHasError((prevState) => ({ ...prevState, [name]: hasError }));
  };

  const debouncedFields = ['email'];
  const fields = ['password', 'confirmPassword'];
  return (
    <Container className="content">
      <Form>
        {debouncedFields.map((name) => (
          <DebouncedField
            name={name}
            formik={formik}
            placeholder={translate('editProfile.form_fields.' + name) as string}
            onValidateError={(hasError) => handleError(hasError, name)}
            onChange={formik.handleChange}
            shouldValidate
          />
        ))}
        {fields.map((name) => (
          <FormField
            name={name}
            formik={formik}
            placeholder={translate('editProfile.form_fields.' + name) as string}
            onChange={formik.handleChange}
            shouldValidate
          />
        ))}
        <Divider hidden />
        <Form.Button
          color="green"
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || hasError.email || loading}
          loading={loading}
        >
          <Icon name="wrench" /> {translate('editProfile.form_fields.submit')}
        </Form.Button>
      </Form>
    </Container>
  );
};

export default withLocalize(EditProfile);
