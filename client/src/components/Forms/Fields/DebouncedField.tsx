import React, { useState, useCallback } from 'react';
import FormField, { FormFieldProps } from './FormField';
import { withLocalize, LocalizeContextProps } from 'react-localize-redux';
import User from 'classes/User';
import _ from 'lodash';
import { Icon, Loader, Grid } from 'semantic-ui-react';

export interface UsernameFieldProps extends FormFieldProps, LocalizeContextProps {
  onValidateError: (e: boolean) => void;
}

const DebouncedField: React.SFC<UsernameFieldProps> = ({
  translate,
  formik,
  onValidateError,
  placeholder,
  name
}) => {
  const [usernameError, setUsernameError] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);

  const debouncedCheckUsername = useCallback(
    _.debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const isAvailable = await User.checkAvailable({ [e.target.name]: e.target.value });
      setCheckLoading(false);
      if (!isAvailable) {
        onValidateError(true);
        return setUsernameError(translate('signup.errs.username_taken') as string);
      }
      onValidateError(false);
      setUsernameError(''); // If available remove error
    }, 1000),
    []
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    onValidateError(true);
    setCheckLoading(true);
    debouncedCheckUsername(e);
  };

  const availableInput = () => {
    if (checkLoading)
      return (
        <div>
          <Loader active inline size="tiny" />
          {`Tjekker ${placeholder}`}
        </div>
      );
    if (usernameError)
      return (
        <div>
          <Icon name="x" color="red" />
          {`${placeholder} eksisterer allerede`}
        </div>
      );
    return (
      <div>
        <Icon name="check" color="green" />
        {`${placeholder} er tilgængeligt!`}
      </div>
    );
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <Grid stackable columns="2" verticalAlign="middle">
        <Grid.Row>
          <Grid.Column>
            <FormField
              onChange={onChange}
              formik={formik}
              shouldValidate
              name={name}
              placeholder={placeholder}
            />
          </Grid.Column>
          <Grid.Column>{formik.values[name].length > 1 && availableInput()}</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default withLocalize(DebouncedField);
