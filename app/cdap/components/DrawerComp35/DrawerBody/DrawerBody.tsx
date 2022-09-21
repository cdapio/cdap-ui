import React from 'react';
import { Divider } from '@material-ui/core';
import { useDrawerCss } from '../styles';
import { SearchIcon, Icon1, Icon2, Icon3, Icon4 } from '../iconStore';
import { Checkbox } from '@material-ui/core';

const DrawerBody = () => {
  const classes = useDrawerCss();

  return (
    <React.Fragment>
      <div>
        <div className={classes.paddingDiv + ' ' + classes.flexBetweenBaseLine}>
          <p className={classes.weight400}>No columns selected</p>
          {SearchIcon}
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <p className={classes.weight40}> Columns(30)</p>
          </div>
          <p className={classes.weight40}> Data Quality</p>
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <div>
              <p className={classes.weight400 + ' ' + classes.marginTopp}> Customer Name</p>
              <p className={classes.weight400}> ABC | String</p>
            </div>
          </div>
          <p className={classes.weight400 + ' ' + classes.marginRightt}> {Icon1}</p>
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <div>
              <p className={classes.weight400}> Region</p>
              <p className={classes.weight400}> ABC | String</p>
            </div>
          </div>
          <p className={classes.weight400 + ' ' + classes.marginRightt}> {Icon2}</p>
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <div>
              <p className={classes.weight400}> Car Model</p>
              <p className={classes.weight400}> ABC | String</p>
            </div>
          </div>
          <p className={classes.weight400 + ' ' + classes.marginRightt}> {Icon3}</p>
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <div>
              <p className={classes.weight400}> CC Number</p>
              <p className={classes.weight400}> ABC | Credit Card</p>
            </div>
          </div>
          <p className={classes.weight400 + ' ' + classes.marginRightt}> {Icon3}</p>
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <div>
              <p className={classes.weight400}> Purchase Date</p>
              <p className={classes.weight400}> ABC | Date and Time</p>
            </div>
          </div>
          <p className={classes.weight400 + ' ' + classes.marginRightt}> {Icon3}</p>
        </div>
        <Divider />

        <div className={classes.flexBetweenBaseLine + ' ' + classes.containerWrapper}>
          <div className={classes.flexOnly}>
            <Checkbox size="medium" color="primary" />
            <div>
              <p className={classes.weight400}> Payment Mode</p>
              <p className={classes.weight400}> ABC | String</p>
            </div>
          </div>
          <p className={classes.weight400 + ' ' + classes.marginRightt}> {Icon4}</p>
        </div>
        <Divider />
      </div>
    </React.Fragment>
  );
};
export default DrawerBody;
