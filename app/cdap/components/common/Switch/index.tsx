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
import { styled } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import grey from '@material-ui/core/colors/grey';
import { ISwitchProps } from 'components/common/Switch/types';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '& .MuiSwitch-input': {
    left: 0,
    width: '100%',
  },
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    color: grey[600],
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: grey[600],
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#ffffff',
        border: `1px solid ${grey[600]}`,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 #00230b33',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 8,
    opacity: 1,
    backgroundColor: '#ffffff',
    border: `1px solid ${grey[600]}`,
    boxSizing: 'border-box',
  },
}));

export default function({ setShow, show, inputProps }: ISwitchProps) {
  return <StyledSwitch onClick={() => setShow(!show)} checked={show} inputProps={inputProps} />;
}
