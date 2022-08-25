import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Button } from '@material-ui/core';
import { useStyles } from './styles';
import { FORMAT_OPTIONS, ENCODING_OPTIONS } from './options';
import { APPLY_BUTTON, PARSING_INFO_TEXT } from './constants';
import ParsingPopupHeader from './Components/ParsingPopupHeader';
import ParsingPopupBody from './Components/ParsingPopupBody';

const ParsingDrawer = (props) => {
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [formatValue, setFormatValue] = useState(FORMAT_OPTIONS[0].value);
  const [encodingValue, setEncodingValue] = useState(ENCODING_OPTIONS[0].value);
  const [quotedValuesChecked, setQuotedValuesChecked] = useState(false);
  const [headerValueChecked, setHeaderValueChecked] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setDrawerStatus(true);
  }, []);

  const closeClickHandler = () => {
    setDrawerStatus(false);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as any;
    setFormatValue(value);
  };

  const handleEncodingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as any;
    setEncodingValue(value);
  };

  const handleQuoteValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuotedValuesChecked(event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderValueChecked(event.target.checked);
  };

  const handleApply = (event: React.MouseEvent<HTMLButtonElement>) => {
    // do nothing
  };

  const componentToRender = (
    <Drawer classes={{ paper: classes.paper }} anchor="right" open={drawerStatus}>
      <Box className={classes.parsingDrawerStyles} sx={{ width: 460 }} role="presentation">
        <ParsingPopupHeader closeClickHandler={closeClickHandler} />

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
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleApply(e)}
            >
              {APPLY_BUTTON}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );

  return drawerStatus && componentToRender;
};

export default ParsingDrawer;
