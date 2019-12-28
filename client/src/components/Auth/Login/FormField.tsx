import React from 'react';
import { Form } from 'semantic-ui-react';

export interface FormFieldProps {
  name: string;
  error: string;
  touched: boolean;
  onChange: (value: string) => void;
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
      <Form.Input onChange={(e, { value }) => onChange(value)} name={name} value={value} />
      {error && touched && <div>{error}</div>}
    </>
  );
};

export default FormField;
