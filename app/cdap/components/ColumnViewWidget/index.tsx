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

import { Box, Typography } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import React, { Fragment, useRef, useState } from 'react';
import DrawerWidgetHeading from 'components/ColumnViewWidget/DrawerWidgetHeading';
import { useStyles } from 'components/ColumnViewWidget/styles';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import { IColumnViewWidget } from 'components/ColumnViewWidget/types';

export default function({
  headingText,
  closeClickHandler,
  searchedTermHandler,
  children,
}: IColumnViewWidget) {
  const classes = useStyles();
  const [focused, setFocused] = useState<boolean>(false);
  const ref = useRef(null);

  const handleFocus = () => {
    ref?.current.focus();
    setFocused(true);
  };

  return (
    <Box
      className={classes.drawerContainerStyles}
      role="presentation"
      data-testid="column-view-panel-parent"
    >
      <header className={classes.headerStyles}>
        <div className={classes.headerTextWithBackIconStyles}>
          <DrawerWidgetHeading headingText={headingText} />
        </div>
        <Box className={classes.headerRightStyles}>
          <Box className={classes.searchFormControl}>
            <input
              className={`${classes.searchInput} ${
                focused ? classes.isFocused : classes.isBlurred
              }`}
              onChange={(e) => searchedTermHandler(e.target.value)}
              ref={ref}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              data-testid="search-term-input"
            />
            <Typography
              className={classes.searchIcon}
              component="span"
              onClick={handleFocus}
              data-testid="search-icon"
            >
              <SearchIcon />
            </Typography>
          </Box>

          <div className={classes.dividerLineStyles} />
          <CloseRoundedIcon
            className={classes.pointerStyles}
            color="action"
            onClick={closeClickHandler}
            data-testid="column-view-panel-close"
          />
        </Box>
      </header>
      <Fragment>{children}</Fragment>
    </Box>
  );
}
