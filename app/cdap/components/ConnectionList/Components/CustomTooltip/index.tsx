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

import { Box, Tooltip, TooltipProps } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme) => ({
  arrow: {
    color: '#000000',
  },
  tooltip: {
    backgroundColor: '#000000',
    fontSize: '16px',
  },
}));

const TooltipContainer = styled(Box)`
  width: 100%;
`;

export default function CustomTooltip(props: TooltipProps) {
  const classes = useStyles();

  return (
    <TooltipContainer data-testid="tooltip-parent">
      <Tooltip arrow classes={classes} {...props} />
    </TooltipContainer>
  );
}
