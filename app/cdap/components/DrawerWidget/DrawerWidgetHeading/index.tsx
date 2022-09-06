import { Box } from '@material-ui/core';
import React from 'react';
import { useStyles } from '../styles';
import { UnderLine } from 'components/WrangleHome/icons';

const DrawerWidgetHeading = (props) => {
  const { headingText } = props;
  const classes = useStyles();

  return (
    <Box className={classes.headingStyles}>
      <div className={classes.headingTextStyles}>{headingText}</div>
      {/* <img src="/cdap_assets/img/Underline.svg" alt="header line" /> */}
      {UnderLine}
    </Box>
  );
};

export default DrawerWidgetHeading;
