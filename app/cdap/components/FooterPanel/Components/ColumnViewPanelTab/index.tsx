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

import { Box } from '@material-ui/core';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { PREFIX } from 'components/FooterPanel';
import { ColumnIcon } from 'components/FooterPanel/IconStore/ColumnIcon';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';

const ColumnViewBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px 32px;
  gap: 8px;
  width: 88px;
  height: 40px;
  border-left: 1px solid #3994ff66;
  flex: none;
  order: 0;
  flex-grow: 0;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-right: 1px solid #3994ff66;
  cursor: pointer;
`;

export default function() {
  return (
    <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
      <ColumnViewBox data-testid="footer-panel-column-view-panel-tab">{ColumnIcon}</ColumnViewBox>
    </CustomTooltip>
  );
}
