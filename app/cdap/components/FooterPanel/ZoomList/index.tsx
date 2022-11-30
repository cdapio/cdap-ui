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

import React from 'react';
import Popover from '@material-ui/core/Popover';
import { MenuItem } from '@material-ui/core';
import styled from 'styled-components';

const PopoverComponent = styled(Popover)`
  & .MuiPopover-paper {
    width: 10%;
    border: 1px solid #e0e0e0;
    box-shadow: 3px 4px 15px rgba(33, 150, 243, 0.15);
  }
`;

const ZOOM_OPTIONS = [
  {
    label: '200%',
    value: 200,
  },
  {
    label: '150%',
    value: 150,
  },
  {
    label: '125%',
    value: 125,
  },
  {
    label: '100%',
    value: 100,
  },
  {
    label: '90%',
    value: 90,
  },
  {
    label: '75%',
    value: 75,
  },
  {
    label: '50%',
    value: 50,
  },
];

export default function({ open, setZoomPercent, anchorEl }) {
  return (
    <PopoverComponent
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {ZOOM_OPTIONS.map((eachOption, optionIndex) => {
        return (
          <MenuItem
            value={eachOption.value}
            onClick={() => setZoomPercent(eachOption.value)}
            data-testid={`zoom-list-menu-item-${optionIndex}`}
          >
            {eachOption.label}
          </MenuItem>
        );
      })}
    </PopoverComponent>
  );
}
