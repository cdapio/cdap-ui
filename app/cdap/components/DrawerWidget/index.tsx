import { Box, Container, Drawer } from '@material-ui/core';
import React, { Fragment } from 'react';
import { useStyles } from './styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DrawerWidgetHeading from './DrawerWidgetHeading';

const DrawerWidget = (props) => {
  const classes = useStyles();
  const {
    headingText,
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
          <DrawerWidgetHeading headingText={headingText} />
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
