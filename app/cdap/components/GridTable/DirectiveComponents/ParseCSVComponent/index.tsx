import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import InputCheckbox from 'components/ParsingDrawer/Components/InputCheckbox';
import React, { useState } from 'react';
import { PLEASE_SELECT_THE_DELIMITER, SET_FIRST_ROW_AS_HEADER } from './constants';
import { PARSE_CSV_OPTIONS } from './options';
import { useStyles } from './styles';

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
      <FormGroup className={classes.formGroupStyles}>
        <FormControl>
          <RadioGroup
            name="actions"
            value={selectedParseType}
            onChange={(e) => setSelectedParseType(e.target.value)}
          >
            {PARSE_CSV_OPTIONS.map((eachRadio) => (
              <FormControlLabel
                value={eachRadio.value}
                className={classes.radioStyles}
                control={<Radio color="primary" />}
                label={eachRadio.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {selectedParseType === 'customDelimiter' && (
          <FormControlLabel
            value="delimiterValue"
            className={classes.formFieldStyles}
            control={
              <Input
                classes={{
                  underline: classes.underlineStyles,
                  input: classes.inputStyles,
                }}
                type="text"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                color="primary"
              />
            }
            label={''}
          />
        )}
        <InputCheckbox
          label={SET_FIRST_ROW_AS_HEADER}
          value={firstRowAsHeader}
          onChange={(e) => setFirstRowAsHeader(e.target.checked)}
          className={classes.checkboxStyles}
        />
      </FormGroup>
    </section>
  );
};

export default ParseCSVComponent;
