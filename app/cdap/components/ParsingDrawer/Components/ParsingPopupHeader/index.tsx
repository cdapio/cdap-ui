import React from 'react';
import { useStyles } from '../../styles';
import { Box, Container } from '@material-ui/core';
import { IMPORT_SCHEMA, PARSING } from 'components/ParsingDrawer/constants';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const ParsingPopupHeader = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.headerStyles}>
      <Box className={classes.headingStyles}>
        <div className={classes.headingTextStyles}>{PARSING}</div>
        <img src="/cdap_assets/img/Underline.svg" alt="header line" />
      </Box>
      <Box className={classes.headerRightStyles}>
        <div className={classes.pointerStyles}>
          <img
            className={classes.importIconStyles}
            src="/cdap_assets/img/import.svg"
            alt="import schema icon"
          />
          <span className={classes.importSchemaTextStyles}>{IMPORT_SCHEMA}</span>
        </div>
        <div className={classes.dividerLineStyles} />
        <CloseRoundedIcon color="action" fontSize="large" onClick={props.closeClickHandler} />
      </Box>
    </Container>
  );
};

export default ParsingPopupHeader;
