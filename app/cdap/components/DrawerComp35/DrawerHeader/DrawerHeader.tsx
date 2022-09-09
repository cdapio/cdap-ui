import React from 'react';
import { useDrawerCss } from '../styles';
import { closeOutLine, UnderLine, Arrow } from '../iconStore';

const DrawerHeader = (props) => {
  const classes = useDrawerCss();
  return (
    <React.Fragment>
      <div className={classes.flexBetweenBaseLine + ' ' + classes.paddingDiv}>
        {Arrow}
        <div>
          <h3 className={classes.headerTitle}>Select Column(s) to Apply This Function</h3>
          {UnderLine}
        </div>
        <div onClick={props.toggleDrawer}>{closeOutLine()}</div>
      </div>
    </React.Fragment>
  );
};

export default DrawerHeader;
