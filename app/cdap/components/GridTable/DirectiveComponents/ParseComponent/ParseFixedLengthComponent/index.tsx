import { FormGroup } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import ParseComponent from '..';
import {
  COLUMN_WIDTHS,
  COLUMN_WIDTHS_PLACEHOLDER,
  PADDING,
  PADDING_PLACEHOLDER,
  PARSE_AS_FIXED_LENGTH,
} from '../../constants';
import { useStyles } from '../../styles';
import FormInputFieldComponent from '../FormInputFieldComponent';

const ParseFixedLengthComponent = (props) => {
  const { setDirectiveComponentsValue, directiveComponentValues } = props;
  const [columnWidths, setColumnWidths] = useState('');
  const [padding, setPadding] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, columnWidths });
  }, [columnWidths]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, optionPaddingParam: padding });
  }, [padding]);

  return (
    <ParseComponent sectionHeading={PARSE_AS_FIXED_LENGTH}>
      <FormGroup>
        <div className={classes.formLabelStyles}>{COLUMN_WIDTHS}</div>
        <FormInputFieldComponent
          formInputValue={columnWidths}
          classnames={classes.formFieldStyles}
          inputProps={{
            classes: { underline: classes.underlineStyles, input: classes.inputStyles },
            type: 'number',
            value: columnWidths,
            onChange: (e) => setColumnWidths(e.target.value),
            color: 'primary',
            placeholder: COLUMN_WIDTHS_PLACEHOLDER,
          }}
        />
        <div className={classes.formLabelStyles}>{PADDING}</div>
        <FormInputFieldComponent
          formInputValue={padding}
          classnames={classes.formFieldStyles}
          inputProps={{
            classes: { underline: classes.underlineStyles, input: classes.inputStyles },
            type: 'number',
            value: padding,
            onChange: (e) => setPadding(e.target.value),
            color: 'primary',
            placeholder: PADDING_PLACEHOLDER,
          }}
        />
      </FormGroup>
    </ParseComponent>
  );
};

export default ParseFixedLengthComponent;
