import React, { useState } from 'react';
import ParseComponent from '..';
import { PLEASE_SELECT_THE_DATE_FORMAT } from '../../constants';
import { PARSE_SIMPLE_DATE_OPTIONS } from '../../options';
import InputRadioWithCustomInputComponent from '../InputRadioWithCustomInputComponent';

const ParseSimpleDateComponent = (props) => {
  const [selectedParseType, setSelectedParseType] = useState('');

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_DATE_FORMAT}>
      <InputRadioWithCustomInputComponent
        options={PARSE_SIMPLE_DATE_OPTIONS}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="customFormat"
      />
    </ParseComponent>
  );
};

export default ParseSimpleDateComponent;
