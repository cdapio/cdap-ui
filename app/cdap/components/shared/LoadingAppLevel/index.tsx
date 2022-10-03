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

import { Box, Modal } from '@material-ui/core';
import React from 'react';
import LoadingSVG from '../LoadingSVG';

interface ILoadingAppLevelProps {
  message?: string;
  subtitle?: string;
  isopen: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  fontSize: '84px',
  boxShadow: 24,
  textAlign: 'center',
  pt: 2,
  px: 4,
  pb: 3,
};

export const LoadingAppLevel = ({ message, subtitle, isopen }: ILoadingAppLevelProps) => {
  return (
    <Modal open={isopen}>
      <Box sx={{ ...style }}>
        <LoadingSVG />
        <h2> {message || 'Loading...'} </h2>
        <h4>{subtitle}</h4>
      </Box>
    </Modal>
  );
};
