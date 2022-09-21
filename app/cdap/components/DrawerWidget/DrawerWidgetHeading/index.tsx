import { Box } from '@material-ui/core';
import React from 'react';
import { useStyles } from '../styles';

const DrawerWidgetHeading = (props) => {
  const { headingText } = props;
  const classes = useStyles();

  return (
    <Box className={classes.headingStyles}>
      <div className={classes.headingTextStyles}>{headingText}</div>
      <img src="/cdap_assets/img/Underline.svg" alt="header line" />
    </Box>
  );
};

export default DrawerWidgetHeading;
