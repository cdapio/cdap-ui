import React from 'react';
import { Button } from '@material-ui/core';
import { useDrawerCss } from '../styles';

const DFooter = () => {
  const classes = useDrawerCss();
  return (
    <React.Fragment>
      <div style={{ textAlign: 'right' }}>
        <Button variant="contained" className={classes.footerButton}>
          Done
        </Button>
      </div>
    </React.Fragment>
  );
};

export default DFooter;
