import { FormControlLabel, Input } from '@material-ui/core';
import React from 'react';

const FormInputFieldComponent = (props) => {
  const { formInputValue, classnames } = props;
  console.log('Propssss', props.inputProps);
  return (
    <FormControlLabel
      value={formInputValue}
      className={classnames}
      control={<Input {...props.inputProps} />}
      label={''}
    />
  );
};

export default FormInputFieldComponent;
