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

import { Box, Container, Drawer, IconButton } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DrawerWidgetHeading from 'components/DrawerWidget/DrawerWidgetHeading';
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
  dataTestId,
}: IDrawerWidgetProps) {
  const classes = useStyles();

  return (
    <Drawer classes={{ paper: classes.paper }} anchor={anchor ? anchor : 'right'} open={openDrawer}>
      <Container
        className={classes.drawerContainerStyles}
        role="presentation"
        data-testid={dataTestId}
      >
        <header className={classes.headerStyles}>
          <div className={classes.headerTextWithBackIconStyles}>
            {showBackIcon && (
              <IconButton
                aria-label="back-icon"
                data-testid="back-icon"
                onClick={closeClickHandler}
                className={classes.headerBackIconStyles}
              >
                <ChevronLeftRoundedIcon fontSize="large" />
              </IconButton>
            )}
            <DrawerWidgetHeading headingText={headingText} />
          </div>
          <Box className={classes.headerRightStyles}>
            {headerActionTemplate && <div>{headerActionTemplate}</div>}
            {showDivider && <div className={classes.dividerLineStyles} />}
            <IconButton
              data-testid="close-icon"
              aria-label="close-icon"
              className={classes.closeButtonStyle}
              onClick={closeClickHandler}
            >
              <CloseRoundedIcon color="action" fontSize="large" />
            </IconButton>
          </Box>
        </header>
        <Fragment>{children}</Fragment>
      </Container>
    </Drawer>
  );
}
