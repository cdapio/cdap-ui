/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React, { useEffect } from 'react';
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
import { CHAR_ENCODING_OPTIONS, FORMAT_OPTIONS } from './options';

export default function(props) {
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

  let selectedFormatValue = [];
  let selectedEncodingValue = [];

  useEffect(() => {
    selectedFormatValue = FORMAT_OPTIONS.filter((i) => i.value === formatValue);
  }, [formatValue]);

  useEffect(() => {
    selectedEncodingValue = CHAR_ENCODING_OPTIONS.filter((i) => i.value === encodingValue);
  }, [encodingValue]);

  return (
    <Box>
      <Box className={`${classes.formFieldWrapperStyles} ${classes.marginBottomStyles}`}>
        <InputLabel id="label" className={classes.labelTextStyles}>
          {FORMAT}
        </InputLabel>
        <InputSelect
          classes={{
            icon: classes.selectIconStyles,
            select: classes.selectStyles,
          }}
          className={classes.selectFieldStyles}
          optionClassName={{ root: classes.optionStyles }}
          fullWidth
          defaultValue={FORMAT_OPTIONS[0].value}
          value={selectedFormatValue[0]?.value}
          onChange={handleFormatChange}
          options={FORMAT_OPTIONS}
        />
      </Box>

      <Box className={`${classes.formFieldWrapperStyles} ${classes.marginBottomStyles}`}>
        <InputLabel id="label" className={classes.labelTextStyles}>
          {ENCODING}
        </InputLabel>
        <InputSelect
          classes={{
            icon: classes.selectIconStyles,
            select: classes.selectStyles,
          }}
          className={classes.selectFieldStyles}
          optionClassName={{ root: classes.optionStyles }}
          defaultValue={CHAR_ENCODING_OPTIONS[0].value}
          fullWidth
          value={selectedEncodingValue[0]?.value}
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
}
