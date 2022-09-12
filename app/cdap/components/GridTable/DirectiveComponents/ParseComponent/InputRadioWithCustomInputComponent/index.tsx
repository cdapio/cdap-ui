import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../../styles';

const InputRadioWithCustomInputComponent = (props) => {
  const {
    options,
    radioValue,
    setRadioValue,
    customInputType,
    customInput,
    setCustomInput,
  } = props;
  const classes = useStyles();

  return (
    <FormGroup className={classes.formGroupStyles}>
      <FormControl>
        <RadioGroup
          name="actions"
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
        >
          {options.map((eachRadio) => (
            <FormControlLabel
              value={eachRadio.value}
              className={classes.radioStyles}
              control={<Radio color="primary" />}
              label={eachRadio.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {radioValue === customInputType && (
        <FormControlLabel
          value={customInput}
          className={classes.formFieldStyles}
          control={
            <Input
              classes={{
                underline: classes.underlineStyles,
                input: classes.inputStyles,
              }}
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              color="primary"
            />
          }
          label={''}
        />
      )}
    </FormGroup>
  );
};

export default InputRadioWithCustomInputComponent;
