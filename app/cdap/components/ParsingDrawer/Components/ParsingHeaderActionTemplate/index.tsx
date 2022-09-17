import { Box } from '@material-ui/core';
import { IMPORT_SCHEMA } from 'components/ParsingDrawer/constants';
import { useStyles } from 'components/ParsingDrawer/styles';
import React from 'react';

const ParsingHeaderActionTemplate = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.pointerStyles}>
      <img
        className={classes.importIconStyles}
        src="/cdap_assets/img/import.svg"
        alt="import schema icon"
      />
      <span className={classes.importSchemaTextStyles}>{IMPORT_SCHEMA}</span>
    </Box>
  );
};

export default ParsingHeaderActionTemplate;
