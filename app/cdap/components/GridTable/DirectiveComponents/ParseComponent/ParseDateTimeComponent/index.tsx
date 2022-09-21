import React, { useState, useEffect } from 'react';
import ParseComponent from '..';
import { PLEASE_SELECT_THE_DATE_FORMAT } from '../../constants';
import { PARSE_DATE_TIME_OPTIONS, PARSE_SIMPLE_DATE_OPTIONS } from '../../options';
import InputRadioWithCustomInputComponent from '../InputRadioWithCustomInputComponent';

const ParseDateTimeComponent = (props) => {
  const { setDirectiveComponentsValue, directiveComponentValues } = props;
  const [customFormat, setCustomFormat] = useState('');
  const [selectedParseType, setSelectedParseType] = useState('');

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, radioOption: selectedParseType });
  }, [selectedParseType]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, customInput: customFormat });
  }, [customFormat]);

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_DATE_FORMAT}>
      <InputRadioWithCustomInputComponent
        options={PARSE_DATE_TIME_OPTIONS}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="customFormat"
        customInput={customFormat}
        setCustomInput={setCustomFormat}
      />
    </ParseComponent>
  );
};

export default ParseDateTimeComponent;
