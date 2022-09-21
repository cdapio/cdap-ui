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
import InputCheckbox from '../InputCheckbox';
import T from 'i18n-react';

const PREFIX = 'features.DataPrep.Directives.SetCharEncoding';
const SUFFIX = 'features.DataPrep.Directives.Parse';

const CHAR_ENCODING_OPTIONS = [
  {
    label: T.translate(`${PREFIX}.utf8`),
    value: T.translate(`${PREFIX}.utf8`),
  },
  {
    label: T.translate(`${PREFIX}.utf16`),
    value: T.translate(`${PREFIX}.utf16`),
  },
  {
    label: T.translate(`${PREFIX}.usascii`),
    value: T.translate(`${PREFIX}.usascii`),
  },
  {
    label: T.translate(`${PREFIX}.iso88591`),
    value: T.translate(`${PREFIX}.iso88591`),
  },
  {
    label: T.translate(`${PREFIX}.utf16be`),
    value: T.translate(`${PREFIX}.utf16be`),
  },
  {
    label: T.translate(`${PREFIX}.utf16le`),
    value: T.translate(`${PREFIX}.utf16le`),
  },
];

const FORMAT_OPTIONS = [
  {
    label: T.translate(`${SUFFIX}.Parsers.CSV.label`),
    value: T.translate(`${SUFFIX}.Parsers.CSV.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.EXCEL.label`),
    value: T.translate(`${SUFFIX}.Parsers.EXCEL.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.FIXEDLENGTH.label`),
    value: T.translate(`${SUFFIX}.Parsers.FIXEDLENGTH.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.HL7.label`),
    value: T.translate(`${SUFFIX}.Parsers.HL7.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.JSON.label`),
    value: T.translate(`${SUFFIX}.Parsers.JSON.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.LOG.label`),
    value: T.translate(`${SUFFIX}.Parsers.LOG.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.NATURALDATE.label`),
    value: T.translate(`${SUFFIX}.Parsers.NATURALDATE.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.SIMPLEDATE.label`),
    value: T.translate(`${SUFFIX}.Parsers.SIMPLEDATE.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.DATETIME.label`),
    value: T.translate(`${SUFFIX}.Parsers.DATETIME.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.XMLTOJSON.label`),
    value: T.translate(`${SUFFIX}.Parsers.XMLTOJSON.label`),
  },
];

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
          optionClassName={{ root: classes.optionStyles }}
          fullWidth
          defaultValue={FORMAT_OPTIONS[0].value}
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
          optionClassName={{ root: classes.optionStyles }}
          defaultValue={CHAR_ENCODING_OPTIONS[0].value}
          fullWidth
          value={encodingValue}
          onChange={handleEncodingChange}
          options={CHAR_ENCODING_OPTIONS}
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
