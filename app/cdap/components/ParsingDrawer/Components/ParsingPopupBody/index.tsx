import React from 'react';
import { Box, InputLabel } from '@material-ui/core';
import { useStyles } from '../../styles';
import InputSelect from '../InputSelect';
import {
  ENABLE_QUOTED_VALUES,
  ENCODING,
  FORMAT,
  USE_FIRST_ROW_AS_HEADER,
} from 'components/ParsingDrawer/constants';
import { ENCODING_OPTIONS, FORMAT_OPTIONS } from 'components/ParsingDrawer/options';
import InputCheckbox from '../InputCheckbox';

const ParsingPopupBody = (props) => {
  const classes = useStyles();
  const {
    formatValue,
    handleFormatChange,
    encodingValue,
    handleEncodingChange,
    quotedValuesChecked,
    handleQuoteValueChange,
    headerValueChecked,
    handleCheckboxChange,
  } = props;

  return (
    <Box>
      <Box className={[classes.formFieldWrapperStyles, classes.marginBottomStyles].join(' ')}>
        <InputLabel id="label" className={classes.labelTextStyles}>
          {FORMAT}
        </InputLabel>
        <InputSelect
          classes={{ icon: classes.selectIconStyles, select: classes.selectStyles }}
          className={classes.selectFieldStyles}
          fullWidth
          value={formatValue}
          onChange={handleFormatChange}
          options={FORMAT_OPTIONS}
        />
      </Box>

      <Box className={[classes.formFieldWrapperStyles, classes.marginBottomStyles].join(' ')}>
        <InputLabel id="label" className={classes.labelTextStyles}>
          {ENCODING}
        </InputLabel>
        <InputSelect
          classes={{ icon: classes.selectIconStyles, select: classes.selectStyles }}
          className={classes.selectFieldStyles}
          fullWidth
          value={encodingValue}
          onChange={handleEncodingChange}
          options={ENCODING_OPTIONS}
        />
      </Box>

      <InputCheckbox
        label={ENABLE_QUOTED_VALUES}
        value={quotedValuesChecked}
        onChange={handleQuoteValueChange}
        className={classes.checkboxStyles}
      />

      <InputCheckbox
        label={USE_FIRST_ROW_AS_HEADER}
        value={headerValueChecked}
        onChange={handleCheckboxChange}
        className={classes.checkboxStyles}
      />
    </Box>
  );
};

export default ParsingPopupBody;
