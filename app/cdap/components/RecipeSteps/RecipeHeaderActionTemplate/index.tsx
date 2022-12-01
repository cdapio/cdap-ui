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
import { Box, IconButton } from '@material-ui/core';
import DataPrepStore from 'components/DataPrep/store';
import fileDownload from 'js-file-download';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';

const DownloadMenuActionWrapper = styled(Box)`
  display: flex;
`;

const DownloadButtonStyle = styled(IconButton)`
  cursor: pointer;
  &.MuiIconButton-root {
    padding: 10px;
  }
`;

const DownloadIconStyle = styled(SaveAltOutlinedIcon)`
  width: 20px;
  height: 20px;
`;

const KebabMenuButtonStyle = styled(IconButton)`
  cursor: pointer;
  &.MuiIconButton-root {
    padding: 10px;
  }
`;

const KebabMenuIconStyle = styled(MoreVertOutlinedIcon)`
  width: 20px;
  height: 20px;
  font-size: 26px;
  color: ${grey[600]};
`;

export default function() {
  const handleDownload = () => {
    const state = DataPrepStore.getState().dataprep;
    const workspaceId = state.workspaceId,
      directives = state.directives;

    const data = directives.join('\n'),
      filename = `${workspaceId}-directives.txt`;

    fileDownload(data, filename);
  };

  return (
    <DownloadMenuActionWrapper data-testid="header-action-template-parent">
      <DownloadButtonStyle data-testid="header-action-download-icon" onClick={handleDownload}>
        <DownloadIconStyle data-testid="download-icon" />
      </DownloadButtonStyle>
      <KebabMenuButtonStyle data-testid="header-action-kebab-icon">
        <KebabMenuIconStyle />
      </KebabMenuButtonStyle>
    </DownloadMenuActionWrapper>
  );
}
