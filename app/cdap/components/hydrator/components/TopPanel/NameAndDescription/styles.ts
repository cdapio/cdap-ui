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

import { TextField, Tooltip, withStyles } from '@material-ui/core';
import IconSVG from 'components/shared/IconSVG';
import styled from 'styled-components';
const colors = require('styles/colors.scss');
const errorRed = colors.red03;
const blueType = '#397cf1';
const toolTipBackground = colors.blue07;

export const EllipsisText = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const PipelineName = styled(EllipsisText)`
  font-size: 14px;
  margin-top: 5px;
  line-height: 17px;

  ${({ errorName }) => errorName && `color: ${errorRed};`}
`;

export const PipelineDescription = styled(EllipsisText)`
  color: gray;
  font-size: 12px;
`;

export const CustomTooltip = withStyles(() => {
  return {
    tooltip: {
      fontSize: '13px',
      backgroundColor: `${toolTipBackground} !important`,
    },
    arrow: {
      color: toolTipBackground,
    },
  };
})(Tooltip);

export const ErrorTooltip = withStyles(() => {
  return {
    arrow: {
      color: errorRed,
    },
    tooltip: {
      backgroundColor: `${errorRed} !important`,
    },
  };
})(CustomTooltip);

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 150px;
`;

export const StyledIconSVG = styled(IconSVG)`
  display: inline-block;
  font-size: 20px !important;
  line-height: 35px;
  margin-top: 10px;
`;

export const PipelineType = styled.div`
  display: inline-block;
  padding-left: 7px;
  color: ${blueType};
  text-decoration: none;
`;

export const MetadataLeft = styled.div`
  margin-left: 10px;
  text-align: left !important;
  ${({ expanded }) => expanded && 'width: calc(100% - 250px);'}
`;

export const HydratorMetadata = styled.div`
  width: calc(80vw - 700px);
  display: flex;
  background-color: transparent;
  z-index: 999;
  box-shadow: none;
  overflow: hidden;

  ${({ expanded }) =>
    expanded &&
    `background-color: ${colors.white01};
    height: 185px;
    cursor: auto;
    padding: 10px;
    width: calc(100% - 70px);
    position: absolute;
    box-shadow: 0 7px 7px rgb(0 0 0 / 10%), 0 19px 59px rgb(0 0 0 / 20%);`}

  ${({ disabled }) =>
    disabled &&
    `pointer-events: none;
    opacity: 0.7;`}
`;

export const NameTextField = styled(TextField)`
  width: 100%;
  max-width: 100%;
  .MuiOutlinedInput-input {
    padding: 10px 14px;
  }
`;

export const DescriptionTextField = styled(TextField)`
  width: 100%;
  max-width: 100%;
  margin: 12px 0 15px 0;
`;

export const EditStatus = styled.div`
  width: calc(20vw - 110px);
  flex-wrap: wrap;
  display: flex;
  background-color: transparent;
  padding-top: 10px;
  box-shadow: none;
`;
