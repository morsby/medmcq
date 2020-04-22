import React from 'react';
import { Message } from 'semantic-ui-react';
import { FormikProps } from 'formik';

export interface FormFieldProps {
  name: string;
  formik: FormikProps<any>;
  placeholder: string;
  shouldValidate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.SFC<FormFieldProps> = ({
  name,
  formik,
  placeholder,
  shouldValidate,
  onChange
}) => {
  const { handleBlur, values, touched, errors } = formik;
  return (
    <div style={{ margin: '1rem 0' }}>
      <label>{placeholder.toTitleCase()}</label>
      <input
        type={name.match(/password/i) ? 'password' : undefined}
        onChange={onChange}
        name={name}
        value={values[name]}
        placeholder={placeholder}
        onBlur={handleBlur}
      />
      {errors[name] && touched[name] && shouldValidate && (
        <Message color="red" size="small">
          {errors[name]}
        </Message>
      )}
    </div>
  );
};

export default FormField;
