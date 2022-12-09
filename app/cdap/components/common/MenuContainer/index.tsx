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

import { Menu } from '@material-ui/core';
import styled from 'styled-components';
import { grey } from '@material-ui/core/colors';

export const StyledMenuComponent = styled(Menu)`
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 232px;
  top: -13px !important;
  & > div {
    position: absolute !important;
  }
  & .MuiMenuItem-root {
    padding: 6px 20px 6px 20px;
    height: 33px;
  }
  & .MuiMenu-paper {
    width: 199px;
    max-height: 70% !important;
  }
  & .MuiMenu-list {
    color: ${grey[600]};
    border: 1px solid #dadce0;
  }
  & .MuiListItem-button {
    display: flex;
    justify-content: space-between;
  }
  & .MuiListItem-button:hover {
    background: ${grey[300]};
  }
  & .MuiList-padding {
    padding: 13px 0;
  }
  $ .MuiPaper-root {
    box-shadow: 3px 4px 15px rgba(68, 132, 245, 0.15);
  }
`;

export const NestedMenuComponent = styled(Menu)`
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  & .MuiMenuItem-root {
    padding: 6px 20px 6px 20px;
    height: 33px;
  }
  & .MuiMenu-paper {
    width: 199px;
    max-height: 70% !important;
    top: 145px !important;
  }
  & .MuiMenu-list {
    color: ${grey[600]};
    border: 1px solid #dadce0;
  }
  & .MuiListItem-button {
    display: flex;
    justify-content: space-between;
  }
  & .MuiListItem-button:hover {
    background: ${grey[300]};
  }
  & .MuiList-padding {
    padding: 13px 0;
  }
  $ .MuiPaper-root {
    box-shadow: 3px 4px 15px rgba(68, 132, 245, 0.15);
  }
`;
