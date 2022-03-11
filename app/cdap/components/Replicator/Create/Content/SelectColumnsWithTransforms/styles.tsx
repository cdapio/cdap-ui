/*
 * Copyright © 2021 Cask Data, Inc.
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
import React from 'react';
import styled from 'styled-components';

import { Button, Checkbox, Grid, Radio, RadioGroup } from '@material-ui/core';
import ChevronRight from '@material-ui/icons/ChevronRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PrimaryOutlinedButton from 'components/shared/Buttons/PrimaryOutlinedButton';

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 4;
`;

export const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 30px;
  background-color: ${(props) => props.theme.palette.white[50]};
  border: 1px solid ${(props) => props.theme.palette.white[50]};
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  background-color: #f5f5f5;
  padding: 64px 30px 15px;
  border: 0;
`;

export const ActionButtons = styled.div`
  text-align: right;
  & > button:not(:last-child): {
    margin-right: 25px;
  }
`;

const radioStyles = 'padding: 0;';

export const StyledRadio = styled(Radio)`
  ${radioStyles}
  margin-right: 10px;
`;

export const StyledCheckbox = styled(Checkbox)`
  ${radioStyles}
`;

export const SubtitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div: {
    margin-right: 25px;
  }
`;

export const RadioContainer = styled.div`
  padding-left: 10px;
  margin-top: 15px;
  margin-bottom: 5px;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  align-items: flex-start;
`;

export const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const LineForArrow = styled.span`
  min-width: 90%;
  margin-right: -9px;
  &:before {
    background-color: #d7d7d7;
    content: '';
    display: inline-block;
    height: 2px;
    position: relative;
    vertical-align: middle;
    width: 100%;
  }
`;

const ChevWithStyles = styled(ChevronRight)`
  font-size: 22px;
  color: #d7d7d7;
`;

const PointerContainer = styled.div`
  display: flex;
  margin-left: 5px;
`;

export const CenteredTextSpan = styled.span`
  text-align: center;
`;

export const NoPaddingSpanLeft = styled.span`
  padding-bottom: 0;
  margin-bottom: 0;
  text-align: left;
`;

export const PrimaryKeySpan = styled(NoPaddingSpanLeft)`
  padding-left: 40%;
`;

export const NoPaddingSpan = styled(CenteredTextSpan)`
  padding-bottom: 0;
  margin-bottom: 0;
`;

export const SubHeaderSpanNoPad = styled(NoPaddingSpan)`
  font-family: roboto;
  font-size: 13px;
  font-weight: 800;
  color: #666666;
`;

export const SubHeaderSpanNoPadLeft = styled(SubHeaderSpanNoPad)`
  text-align: left;
`;

export const KeySubHeaderSpan = styled(SubHeaderSpanNoPadLeft)`
  padding-left: 40%;
`;

export const SubHeaderSpan = styled(CenteredTextSpan)`
  font-family: roboto;
  font-size: 13px;
  font-weight: 800;
  color: #666666;
`;

export const ArrowRight = () => (
  <PointerContainer>
    <LineForArrow />
    <ChevWithStyles />
  </PointerContainer>
);

export const GridCell = styled(Grid)`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const GridButtonCell = styled(Grid)`
  display: flex;
  vertical-align: middle;
`;

export const HeaderWithLineThrough = styled.p`
  margin: 0 20px;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  color: #666666;

  &:before,
  &:after {
    background-color: #666666;
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 40%;
  }

  &:before {
    right: 0.5em;
    margin-left: -50%;
  }

  &:after {
    left: 0.5em;
    margin-right: -50%;
  }
`;

export const SchemaPropertiesHeader = styled.p`
  margin: 0 20px;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  color: #666666;

  &:before,
  &:after {
    background-color: #666666;
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 5%;
  }

  &:before {
    right: 0.5em;
    margin-left: -50%;
  }

  &:after {
    left: 0.5em;
    margin-right: -50%;
  }
`;

export const GridCellContainer = styled(Grid)`
  padding-left: 20px;
`;

export const HeaderGrid = styled(Grid)`
  background: #f5f5f5;
  color: #666666;
  fontweight: 700;
  padding: 5px 0;
  height: 100%;
`;

export const GridDividerCell = styled(GridCellContainer)`
  border-right: 1px solid #d7d7d7;
`;

export const GridBorderBottom = styled(Grid)`
  border-bottom: 1px solid #d7d7d7;
`;

export const KeyboardArrowDownIconTransformGrid = styled(KeyboardArrowDownIcon)`
  color: #acacac;
  font-size: 24px;
`;

export const WarningMessage = styled.span`
  color: ${(props) => props.theme.palette.red[50]};
`;

export const SmallButton = styled(Button)`
  font-size: 12px;
  align-self: center;
`;

export const RefreshContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: auto;
`;

export const Circle = styled.div`
  width: 15px;
  height: 15px;
  margin: 3px;
  background: #666666;
  border-radius: 50%;
`;

export const NumSpan = styled.span`
  text-align: right;
`;

export const CancelButton = styled(PrimaryOutlinedButton)`
  margin-right: 40px;
`;
