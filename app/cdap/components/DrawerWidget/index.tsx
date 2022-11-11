/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { Box, Container, Drawer } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DrawerWidgetHeading from 'components/DrawerWidget/DrawerWidgetHeader';
import { useStyles } from 'components/DrawerWidget/styles';
import { IDrawerWidgetProps } from 'components/DrawerWidget/types';
import React, { Fragment } from 'react';

export default function({
  headingText,
  openDrawer,
  showDivider,
  headerActionTemplate,
  children,
  closeClickHandler,
  showBackIcon,
  anchor,
}: IDrawerWidgetProps) {
  const classes = useStyles();
  return (
    <Drawer
      classes={{ paper: classes.paper }}
      anchor={anchor ? anchor : 'right'}
      open={openDrawer}
      data-testid="parsing-panel-widget"
    >
      <Container className={classes.drawerContainerStyles} role="presentation">
        <header className={classes.headerStyles}>
          <Box className={classes.headerTextWithBackIconStyles}>
            {showBackIcon && <ChevronLeftRoundedIcon className={classes.chevronLeftRounded} />}
            <DrawerWidgetHeading headingText={headingText} />
          </Box>
          <Box className={classes.headerRightStyles}>
            {headerActionTemplate && <div>{headerActionTemplate}</div>}
            {showDivider && <div className={classes.dividerLineStyles} />}
            <CloseRoundedIcon
              className={classes.pointerStyles}
              color="action"
              fontSize="large"
              onClick={closeClickHandler}
              data-testid="drawer-widget-close-round-icon"
            />
          </Box>
        </header>
        <Fragment>{children}</Fragment>
      </Container>
    </Drawer>
  );
}
