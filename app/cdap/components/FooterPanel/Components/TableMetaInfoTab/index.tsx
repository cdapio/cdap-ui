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
import { PREFIX } from 'components/FooterPanel';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';
import SimpleLabel from 'components/FooterPanel/Components/common/RenderLabel/SimpleLabel';

export interface ITableMetaInfoTabProps {
  rowCount: number;
  columnCount: number;
}

const LargeBox = styled(Box)`
  width: 65%;
  padding: 9.5px 32px;
`;

export default function({ rowCount, columnCount }: ITableMetaInfoTabProps) {
  return (
    <LargeBox data-testid="footer-panel-meta-info-tab">
      <SimpleLabel>
        <>
          {`${T.translate(`${PREFIX}.currentData`)} 
          - ${rowCount} ${T.translate(`${PREFIX}.rows`)} ${T.translate(
            `features.WranglerNewUI.common.and`
          )} ${columnCount} ${T.translate(`${PREFIX}.columns`)}`}
        </>
      </SimpleLabel>
    </LargeBox>
  );
}
