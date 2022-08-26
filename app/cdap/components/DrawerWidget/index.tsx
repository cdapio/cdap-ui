import { Box, Container, Drawer } from '@material-ui/core';
import React, { Fragment } from 'react';
import { useStyles } from './styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const DrawerWidget = (props) => {
  const classes = useStyles();
  const {
    heading_text,
    openDrawer,
    showDivider,
    headerActionTemplate,
    children,
    closeClickHandler,
  } = props;

  return (
    <Drawer classes={{ paper: classes.paper }} anchor="right" open={openDrawer}>
      <Container className={classes.drawerContainerStyles} role="presentation">
        <header className={classes.headerStyles}>
          <Box className={classes.headingStyles}>
            <div className={classes.headingTextStyles}>{heading_text}</div>
            <img src="/cdap_assets/img/Underline.svg" alt="header line" />
          </Box>
          <Box className={classes.headerRightStyles}>
            {headerActionTemplate && <div>{headerActionTemplate}</div>}
            {showDivider && <div className={classes.dividerLineStyles} />}
            <CloseRoundedIcon
              className={classes.pointerStyles}
              color="action"
              fontSize="large"
              onClick={closeClickHandler}
            />
          </Box>
        </header>
        <Fragment>{children}</Fragment>
      </Container>
    </Drawer>
  );
};

export default DrawerWidget;
