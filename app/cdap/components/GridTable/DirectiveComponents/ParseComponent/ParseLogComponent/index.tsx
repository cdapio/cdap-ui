import React, { useState } from 'react';
import ParseComponent from '..';
import { PLEASE_SELECT_THE_LOGS_FORMAT } from '../../constants';
import { PARSE_LOG_OPTIONS } from '../../options';
import InputRadioWithCustomInputComponent from '../InputRadioWithCustomInputComponent';

const ParseLogComponent = (props) => {
  const [selectedParseType, setSelectedParseType] = useState('');

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_LOGS_FORMAT}>
      <InputRadioWithCustomInputComponent
        options={PARSE_LOG_OPTIONS}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="custom"
      />
    </ParseComponent>
  );
};

export default ParseLogComponent;
