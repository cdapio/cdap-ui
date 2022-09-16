import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import InputCheckbox from 'components/ParsingDrawer/Components/InputCheckbox';
import React, { useState, useEffect } from 'react';
import ParseComponent from '..';
import {
  CHOOSE_SHEET_IN_EXCEL,
  SHEET_NAME_PLACEHOLDER,
  SHEET_NUMBER_PLACEHOLDER,
} from '../../constants';
import { PARSE_EXCEL_OPTIONS } from '../../options';
import { useStyles } from '../../styles';
import { SET_FIRST_ROW_AS_HEADER } from '../../constants';

const ParseExcelComponent = (props) => {
  const { setDirectiveComponentsValue, directiveComponentValues } = props;
  const [sheetRadioType, setSheetRadioType] = useState('sheetNumber');
  const [sheetValue, setSheetValue] = useState('');
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, radioOption: sheetRadioType });
  }, [sheetRadioType]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, sheetValue });
  }, [sheetValue]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, firstRowAsHeader });
  }, [firstRowAsHeader]);
  return (
    <ParseComponent sectionHeading={CHOOSE_SHEET_IN_EXCEL}>
      <FormGroup>
        <FormControl>
          <RadioGroup
            name="actions"
            value={sheetRadioType}
            onChange={(e) => setSheetRadioType(e.target.value)}
          >
            {PARSE_EXCEL_OPTIONS.map((eachRadio) => (
              <FormControlLabel
                value={eachRadio.value}
                className={classes.radioStyles}
                control={<Radio color="primary" />}
                label={eachRadio.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControlLabel
          value={sheetValue}
          className={classes.formFieldStyles}
          control={
            <Input
              classes={{
                underline: classes.underlineStyles,
                input: classes.inputStyles,
              }}
              type={sheetRadioType === 'sheetNumber' ? 'number' : 'text'}
              value={sheetValue}
              onChange={(e) => setSheetValue(e.target.value)}
              color="primary"
              placeholder={
                sheetRadioType === 'sheetNumber' ? SHEET_NUMBER_PLACEHOLDER : SHEET_NAME_PLACEHOLDER
              }
            />
          }
          label={''}
        />
        <InputCheckbox
          label={SET_FIRST_ROW_AS_HEADER}
          value={firstRowAsHeader}
          onChange={(e) => setFirstRowAsHeader(e.target.checked)}
          className={classes.checkboxStyles}
        />
      </FormGroup>
    </ParseComponent>
  );
};

export default ParseExcelComponent;
