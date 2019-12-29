import React from 'react';
import { Form } from 'semantic-ui-react';

export interface FormFieldProps {
  name: string;
  error: string;
  touched: boolean;
  onChange: (e: React.ChangeEvent) => void;
  value: string;
  placeholder: string;
}

const FormField: React.SFC<FormFieldProps> = ({
  name,
  error,
  touched,
  onChange,
  value,
  placeholder
}) => {
  return (
    <>
      <label>{placeholder.toTitleCase()}</label>
      <Form.Input
        type={name === 'password' ? 'password' : undefined}
        onChange={(e) => onChange(e)}
        name={name}
        value={value}
      />
      {error && touched && <div>{error}</div>}
    </>
  );
};

export default FormField;
