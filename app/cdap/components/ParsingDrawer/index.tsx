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
import React, { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import Box from '@material-ui/core/Box';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Button } from '@material-ui/core';
import { useStyles } from './styles';
import { APPLY_BUTTON, IMPORT_SCHEMA, PARSING, PARSING_INFO_TEXT } from './constants';
import ParsingPopupBody from './Components/ParsingPopupBody';
import DrawerWidget from 'components/DrawerWidget';
import ParsingHeaderActionTemplate from './Components/ParsingHeaderActionTemplate';

export default function(props) {
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [formatValue, setFormatValue] = useState('');
  const [encodingValue, setEncodingValue] = useState('');
  const [quotedValuesChecked, setQuotedValuesChecked] = useState(false);
  const [headerValueChecked, setHeaderValueChecked] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setDrawerStatus(true);
  }, []);

  const closeClickHandler = () => {
    setDrawerStatus(false);
  };

  const handleFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as string;
    setFormatValue(value);
  };

  const handleEncodingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as string;
    setEncodingValue(value);
  };

  const handleQuoteValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuotedValuesChecked(event.target.checked);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHeaderValueChecked(event.target.checked);
  };

  const handleApply = (event: MouseEvent<HTMLButtonElement>) => {
    // This function will be utilized when this code gets merged with subsequent PR
  };

  const componentToRender = (
    <DrawerWidget
      headingText={PARSING}
      openDrawer={setDrawerStatus}
      showDivider={true}
      headerActionTemplate={<ParsingHeaderActionTemplate />}
      closeClickHandler={closeClickHandler}
    >
      <Box className={classes.bodyContainerStyles}>
        <ParsingPopupBody
          formatValue={formatValue}
          handleFormatChange={handleFormatChange}
          encodingValue={encodingValue}
          handleEncodingChange={handleEncodingChange}
          quotedValuesChecked={quotedValuesChecked}
          handleQuoteValueChange={handleQuoteValueChange}
          headerValueChecked={headerValueChecked}
          handleCheckboxChange={handleCheckboxChange}
        />

        <Box className={classes.bottomSectionStyles}>
          <Box className={classes.infoWrapperStyles}>
            <ErrorOutlineIcon />
            <span className={classes.infoTextStyles}>{PARSING_INFO_TEXT}</span>
          </Box>
          <Button
            variant="contained"
            color="primary"
            classes={{ containedPrimary: classes.buttonStyles }}
            className={classes.applyButtonStyles}
            onClick={(e: MouseEvent<HTMLButtonElement>) => handleApply(e)}
            data-testid="parsing-apply-button"
          >
            {APPLY_BUTTON}
          </Button>
        </Box>
      </Box>
    </DrawerWidget>
  );

  return drawerStatus && componentToRender;
}
