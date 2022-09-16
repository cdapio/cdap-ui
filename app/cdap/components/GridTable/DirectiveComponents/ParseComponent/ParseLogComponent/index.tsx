import React, { useState, useEffect } from 'react';
import ParseComponent from '..';
import { PLEASE_SELECT_THE_LOGS_FORMAT } from '../../constants';
import { PARSE_LOG_OPTIONS } from '../../options';
import InputRadioWithCustomInputComponent from '../InputRadioWithCustomInputComponent';

const ParseLogComponent = (props) => {
  const { setDirectiveComponentsValue, directiveComponentValues } = props;
  const [selectedParseType, setSelectedParseType] = useState('');
  const [delimiter, setDelimiter] = useState('');

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, radioOption: selectedParseType });
  }, [selectedParseType]);

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, customInput: delimiter });
  }, [delimiter]);

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_LOGS_FORMAT}>
      <InputRadioWithCustomInputComponent
        options={PARSE_LOG_OPTIONS}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="custom"
        customInput={delimiter}
        setCustomInput={setDelimiter}
      />
    </ParseComponent>
  );
};

export default ParseLogComponent;
