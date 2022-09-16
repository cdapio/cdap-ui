import InputCheckbox from 'components/ParsingDrawer/Components/InputCheckbox';
import React, { useState, useEffect } from 'react';
import { PLEASE_SELECT_THE_DELIMITER, SET_FIRST_ROW_AS_HEADER } from '../../constants';
import { PARSE_CSV_OPTIONS } from '../../options';
import { useStyles } from '../../styles';
import InputRadioWithCustomInputComponent from '../InputRadioWithCustomInputComponent';
import ParseComponent from '..';

const ParseCSVComponent = (props) => {
  const { setDirectiveComponentsValue, directiveComponentValues } = props;
  const [selectedParseType, setSelectedParseType] = useState('');
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(false);
  const [delimiter, setDelimiter] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, radioOption: selectedParseType });
  }, [selectedParseType]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, customInput: delimiter });
  }, [delimiter]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, firstRowAsHeader });
  }, [firstRowAsHeader]);

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_DELIMITER}>
      <InputRadioWithCustomInputComponent
        options={PARSE_CSV_OPTIONS}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="customDelimiter"
        customInput={delimiter}
        setCustomInput={setDelimiter}
      />
      <InputCheckbox
        label={SET_FIRST_ROW_AS_HEADER}
        value={firstRowAsHeader}
        onChange={(e) => setFirstRowAsHeader(e.target.checked)}
        className={classes.checkboxStyles}
      />
    </ParseComponent>
  );
};

export default ParseCSVComponent;
