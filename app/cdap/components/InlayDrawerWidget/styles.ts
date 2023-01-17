/*
 * Copyright © 2023 Cask Data, Inc.
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

import { Box, Button, IconButton, MenuItem, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import styled from 'styled-components';

export const Container = styled(Box)`
  background-color: #fff;
  border-left: 1px solid ${grey[300]};
  height: calc(100vh - 232px);
  overflow: scroll;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  position: relative;
  width: 500px;
`;

export const Divider = styled.div`
  background-color: ${grey[300]};
  height: 28px;
  margin-bottom: 0px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 0px;
  width: 1px;
`;

export const Label = styled(Typography)`
  &.MuiTypography-body1 {
    color: ${grey[900]};
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.25px;
    line-height: 32px;
    text-align: left;
  }
`;

export const IconWrapper = styled(Box)`
  align-items: center;
  display: flex;

  .MuiIconButton-root {
    margin-left: 12px;
    padding: 0px;
  }
`;

export const StyledHeader = styled.header`
  align-items: center;
  display: flex;
  height: 30px;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  padding-top: 20px;
`;

export const LeftContainer = styled(Container)`
  border-left: none;
  border-right: 1px solid ${grey[300]};
`;

export const MenuButton = styled(Button)`
  &.MuiButton-root {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.25px;
    line-height: 24px;
    text-align: center;
  }
`;

export const StyledIconButton = styled(IconButton)`
  display: flex;
  justify-content: flex-end;
`;

export const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.5px;
    line-height: 24px;
    text-align: left;
  }
`;
