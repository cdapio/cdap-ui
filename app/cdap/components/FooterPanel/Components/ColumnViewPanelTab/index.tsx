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
import TabWrapper from 'components/FooterPanel/Components/common/TabWrapper';
import { PREFIX } from 'components/FooterPanel/constants';
import { ColumnIcon } from 'components/FooterPanel/IconStore/ColumnIcon';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';

export default function({ setOpenColumnViewHandler, gridMetaInfo }) {
  const DisabledStyle = styled(Box)`
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  `;
  return (
    <Box data-testid="footer-panel-column-view-panel-tab-wrapper">
      <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
        <DisabledStyle
          onClick={setOpenColumnViewHandler}
          disabled={gridMetaInfo?.rowCount === 0 ? true : false}
          data-testid="footer-panel-column-view-panel-button"
        >
          <TabWrapper size="small" dataTestID="footer-panel-column-view-panel-tab">
            {ColumnIcon}
          </TabWrapper>
        </DisabledStyle>
      </CustomTooltip>
    </Box>
  );
}
