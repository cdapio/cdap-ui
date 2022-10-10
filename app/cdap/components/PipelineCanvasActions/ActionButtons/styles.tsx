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

import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Tooltip, withStyles } from '@material-ui/core';

const colors = require('styles/colors.scss');
const buttonActive = colors.grey04;
const actionButton = colors.bluegrey07;
const actionButtonBorder = colors.grey11;
const buttonGroupBackgroud = colors.grey07;
const toolTipBackground = colors.blue07;

export const ActionButtonGroup = styled.div`
  background-color: ${buttonGroupBackgroud};
  border-radius: 4px;
  display: inline-block;
  position: fixed;
  width: 37px;
  right: 15px;
  top: 170px;
  vertical-align: middle;
  z-index: 998;
  > * {
    border-radius: 0;
    margin-top: -1px;

    &:first-child {
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
    }

    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

export const ActionButton = styled(Button)`
  border: 1px solid ${actionButtonBorder};
  display: block;
  float: none;
  max-width: 100%;
  position: relative;
  font-size: 12px;
  line-height: 1.5;
  color: ${actionButton};
  background-color: white;
  min-width: unset;
  width: 40px;
  height: 30px;

  ${({ active }) => active && `background-color: ${buttonActive};`}
`;

const CustomTooltip = withStyles(() => {
  return {
    tooltip: {
      fontSize: '11px',
      backgroundColor: toolTipBackground,
    },
    arrow: {
      color: toolTipBackground,
    },
  };
})(Tooltip);

export const CanvasButtonTooltip = ({ children, title = '', ...props }) => {
  return (
    <CustomTooltip arrow placement="left" enterDelay={500} title={title} {...props}>
      {children}
    </CustomTooltip>
  );
};
