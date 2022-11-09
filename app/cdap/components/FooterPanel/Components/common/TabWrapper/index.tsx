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

import { Box } from '@material-ui/core';
import { ITabWrapperProps } from 'components/FooterPanel/Components/common/TabWrapper/types';
import React from 'react';
import { useStyles } from 'components/FooterPanel/Components/common/TabWrapper/styles';

/**
 *
 * @param size small or medium or large, 3 variants of footer tabs
 * @param clickEventListener callback to handle click events on the tabs
 * @param children children to be rendered inside the variants of TabWrapper
 * @param width width in percentage for the medium size variant of TabWrapper
 * @returns TabWrapper with appropriate variations according to props
 */
export default function({
  size,
  clickEventListener,
  children,
  width,
  dataTestID,
}: ITabWrapperProps) {
  const classes = useStyles({ width });
  return (
    <>
      {size === 'small' && (
        <Box className={classes.smallBox} onClick={clickEventListener} data-testid={dataTestID}>
          {children}
        </Box>
      )}
      {size === 'medium' && (
        <Box className={classes.mediumBox} onClick={clickEventListener} data-testid={dataTestID}>
          {children}
        </Box>
      )}
      {size === 'large' && (
        <Box className={classes.largeBox} onClick={clickEventListener} data-testid={dataTestID}>
          {children}
        </Box>
      )}
    </>
  );
}
