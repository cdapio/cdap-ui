import InputCheckbox from 'components/ParsingDrawer/Components/InputCheckbox';
import React, { useState } from 'react';
import { PLEASE_SELECT_THE_DELIMITER, SET_FIRST_ROW_AS_HEADER } from './constants';
import { PARSE_CSV_OPTIONS } from '../options';
import { useStyles } from '../styles';
import InputRadioWithCustomInputComponent from '../InputRadioWithCustomInputComponent';

const ParseCSVComponent = (props) => {
  const [selectedParseType, setSelectedParseType] = useState('');
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(false);
  const [delimiter, setDelimiter] = useState('');
  const classes = useStyles();

  return (
    <section className={classes.functionSectionStyles}>
      <div className={classes.funtionSectionWrapperStyles}>
        <div className={classes.functionHeadingTextStyles}>{PLEASE_SELECT_THE_DELIMITER}</div>
        <img
          className={classes.greenCheckIconStyles}
          src="/cdap_assets/img/green-check.svg"
          alt="tick icon"
        />
      </div>
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
    </section>
  );
};

export default ParseCSVComponent;
