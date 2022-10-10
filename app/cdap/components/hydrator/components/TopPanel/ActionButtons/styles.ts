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

import styled from 'styled-components';
import { Tooltip, withStyles } from '@material-ui/core';
import IconSVG from 'components/shared/IconSVG';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
const colors = require('styles/colors.scss');
const buttonActive = colors.grey10;
const buttonBase = colors.grey02;
const previewActive = colors.grey051;
const greyBorder = colors.grey03;
const stopRed = colors.red03;
const playGreen = colors.green06;
const toolTipBackground = colors.blue07;

export const ActionButtonsContainer = styled.div`
  display: inline-block;
  min-width: 460px;
  position: relative;
  text-align: initial;
  vertical-align: middle;
`;

export const BaseButton = styled(PrimaryTextButton)`
  background-color: ${colors.white01};
  border-left: 1px solid ${greyBorder};
  border-radius: 0;
  color: ${buttonBase};
  padding: 3px 0;
  text-transform: none;
  width: 60px;
  margin: 3px 0;
  height: 40px;
`;

export const BorderRightButton = styled(BaseButton)`
  border-right: 1px solid ${greyBorder};
`;

export const PreviewModeButton = styled(BaseButton)`
  background-color: ${previewActive};
`;

export const CommonButton = styled(BaseButton)`
  margin-left: 2px;
  ${({ active }) => active && `background-color: ${buttonActive};`}
`;

export const CustomTooltip = withStyles(() => {
  return {
    tooltip: {
      fontSize: '13px',
      backgroundColor: toolTipBackground,
    },
    arrow: {
      color: toolTipBackground,
    },
  };
})(Tooltip);

export const ButtonLabel = styled.div`
  font-size: 11px;
  font-weight: normal;
`;

export const IconSliders = styled(IconSVG)`
  transform: rotate(90deg);
`;

export const IconSchedule = styled(IconSVG)`
  font-size: 21px !important;
`;

export const IconPlay = styled(IconSVG)`
  color: ${playGreen};
  font-size: 18px !important;

  ${({ disabled }) => disabled && `opacity: 0.65;`}
`;

export const IconStop = styled(IconSVG)`
  color: ${stopRed};
  font-size: 18px !important;

  ${({ disabled }) => disabled && `opacity: 0.65;`}
`;

export const IconLoading = styled.span`
  font-size: 16px !important;
`;

export const RunTimeSpan = styled.span`
  color: ${colors.bluehydrator};
  cursor: default;
  font-size: 18px;
  line-height: 15px;
  font-weight: 500;
  vertical-align: middle;
`;

export const HiddenInput = styled.input`
  &&& {
    display: none;
  }
`; // beating specificity. The file input needs to be hidden at all times
